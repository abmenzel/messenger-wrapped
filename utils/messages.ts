import { message, thread, threadExcerpt } from '../types/fb'
import { tryFindFile, tryFindFiles } from './files'

const decodeFBString = (str: any) => {
    let arr = []
    for (var i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i))
    }
    return Buffer.from(arr).toString('utf8')
}

const messageCountReducer = (acc: Map<string, number>, m: message) => {
    const prevValue = acc.get(m.sender_name)
    if (!prevValue) {
        acc.set(m.sender_name, 1)
    } else {
        acc.set(m.sender_name, prevValue + 1)
    }
    return acc
}

const messageLengthReducer = (acc: Map<string, number>, m: message) => {
    const prevValue = acc.get(m.sender_name)
    if (!prevValue) {
        acc.set(m.sender_name, m.content ? m.content.length : 0)
    } else {
        acc.set(m.sender_name, prevValue + (m.content ? m.content.length : 0))
    }
    return acc
}

const getLixLevel = (message: string) => {
    console.log("Getting lix for", message)
    const words = message.split(' ')
    const numberOfWords = words.length > 0 ? words.length : 1
    const periodMatches = message.match(/\./g)
    const periods = periodMatches ? (periodMatches.length > 1 ? periodMatches.length : 1) : 1;
    const longWords = words.reduce((acc:number, w:string) => {
        if(w.length > 6){
            return acc + 1
        }else{
            return acc
        }
    },0)

    return (numberOfWords / periods) + (longWords * 100 / numberOfWords)
}

const parseMessage = (message: any, imageMap: Map<string, File>, audioMap: Map<string, File>, videoMap: Map<string, File>): message => {
    return {
        sender_name: message.sender_name ? message.sender_name : 'unknown',
        content: message.content
            ? decodeFBString(message.content)
            : 'no message',
        timestamp_ms: message.timestamp_ms,
        reactions: message.reactions ? message.reactions.map((r: any) => r.reaction) : [],
        photos: message.photos ? tryFindFiles(imageMap, message.photos.map((p: any) => p.uri)) : [],
        videos: message.videos ? tryFindFiles(videoMap, message.videos.map((v: any) => v.uri)) : [],
        audio: message.audio_files ? tryFindFiles(audioMap, message.audio_files.map((a: any) => a.uri)) : [],
    }
}

const getPromiseFromEvent = (item: any, event: any) : Promise<number>=> {
    return new Promise((resolve) => {
        const listener = () => {
            item.removeEventListener(event, listener)
            resolve(item.duration)
        }
        item.addEventListener(event, listener)
    })
}

const collectThreadExcerpts = async (
    files: File[],
    imageMap: Map<string, File>
): Promise<Map<string, threadExcerpt>> => {
    const threads: Map<string, threadExcerpt> = new Map()

    // Create thread map
    for await (const file of files) {
        const content = await file.text()
        const json = await JSON.parse(content)
        const path = json.thread_path
        if (
            !(json.participants?.length > 2) ||
            !json.messages ||
            !json.title
        )
            continue

        const messageCount: number = parseInt(json.messages.length)

        const title: string = json.title
            ? decodeFBString(json.title)
            : 'unknown'

        const image: File | undefined = json.image
            ? tryFindFile(imageMap, json.image.uri)
            : undefined

        if (threads.has(path)) {
            const prev = threads.get(path)
            if (!prev) continue
            threads.set(path, {
                ...prev,
                messageCount: messageCount + prev.messageCount,
                title: title,
                files: [file, ...prev.files],
            })
        } else {
            threads.set(path, {
                messageCount: messageCount,
                title: title,
                image: image,
                files: [file],
            })
        }
    }

    return threads
}

const collectThread = async (
    threadExcerpt: threadExcerpt,
    imageMap: Map<string, File>,
    audioMap: Map<string, File>,
    videoMap: Map<string, File>,
    setUploadStatus: any
): Promise<thread> => {

    const thread: thread = {
        messageCount: threadExcerpt.messageCount,
        audioSeconds: 0,
        photoCount: 0,
        videoCount: 0,
        files: threadExcerpt.files,
        title: threadExcerpt.title,
        messages: [],
        participants: [],
        image: threadExcerpt.image,
    }

    // Create thread map
    for await (const [idx, file] of threadExcerpt.files.entries()) {
        setUploadStatus({step: idx, message: `Getting all messages in file ${idx + 1}`})
        const content = await file.text()
        const json = await JSON.parse(content)
        if (
            !(json.participants?.length > 2) ||
            !json.messages ||
            !json.title
        )
            continue

        const messages: message[] = json.messages.reduce(
            (acc: message[], m: any) => [...acc, parseMessage(m, imageMap, audioMap, videoMap)],
            []
        )

        const photoCount = messages.reduce((acc: number, m) => {
            return acc + m.photos.length
        },0)
        const videoCount = messages.reduce((acc: number, m) => {
            return acc + m.videos.length
        },0)

        let audSeconds = 0

        for await (const m of messages) {
            for await (const audio of m.audio) {
                if(audio != undefined){
                    const audioUrl = URL.createObjectURL(audio)
                    const audioElm = new Audio(audioUrl)
                    const duration = await getPromiseFromEvent(audioElm, 'loadedmetadata').then((duration) => {
                        return duration
                    })
                    audSeconds += duration
                }
            }
        }

        const participants: string[] = json.participants.reduce(
            (acc: string[], p: string) => [...acc, p],
            []
        )

        thread.participants = participants
        thread.audioSeconds = thread.audioSeconds + audSeconds
        thread.videoCount = thread.videoCount + videoCount
        thread.photoCount = thread.photoCount + photoCount
        thread.messages = [...thread.messages, ...messages]
    }
    setUploadStatus({step: threadExcerpt.files.length + 1, message: 'Sorting messages'})

    // Sort messages
    thread.messages.sort((a, b) => a.timestamp_ms - b.timestamp_ms)
    setUploadStatus({step: threadExcerpt.files.length + 2, message: 'Ready'})

    return thread
}

export {decodeFBString, parseMessage, collectThreadExcerpts, collectThread, messageCountReducer, messageLengthReducer, getLixLevel}