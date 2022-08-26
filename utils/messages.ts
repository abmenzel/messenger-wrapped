import { message, thread } from '../types/fb'
import { tryFindFile, tryFindFiles } from './files'

const decodeFBString = (str: any) => {
    let arr = []
    for (var i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i))
    }
    return Buffer.from(arr).toString('utf8')
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

const collectThreads = async (
    files: File[],
    imageMap: Map<string, File>,
    audioMap: Map<string, File>,
    videoMap: Map<string, File>
): Promise<Map<string, thread>> => {
    const threads: Map<string, thread> = new Map()

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
        const messages: message[] = json.messages.reduce(
            (acc: any[], m: any) => [...acc, parseMessage(m, imageMap, audioMap, videoMap)],
            []
        )
        const photoCount = messages.reduce((acc: number, m) => {
            return acc + m.photos.length
        },0)
        const videoCount = messages.reduce((acc: number, m) => {
            return acc + m.videos.length
        },0)

        const audioMinutes = messages.reduce((acc: number, m) => {
            m.audio.forEach((audio) => {
                console.log(audio)
            })
            return acc
        },0)

        const title: string = json.title
            ? decodeFBString(json.title)
            : 'unknown'
        const participants: string[] = json.participants.reduce(
            (acc: string[], p: string) => [...acc, p],
            []
        )
        const image: File | undefined = json.image
            ? tryFindFile(imageMap, json.image.uri)
            : undefined

        if (threads.has(path)) {
            const prev: thread | undefined = threads.get(path)
            if (!prev) continue
            threads.set(path, {
                ...prev,
                messageCount: messageCount + prev.messageCount,
                audioMinutes: audioMinutes + prev.audioMinutes,
                photoCount: photoCount + prev.photoCount,
                videoCount: videoCount + prev.videoCount,
                files: [file, ...prev.files],
                title: title,
                messages: [...messages, ...prev.messages],
                participants: prev.participants,
            })
        } else {
            threads.set(path, {
                messageCount: messageCount,
                audioMinutes: audioMinutes,
                photoCount: photoCount,
                videoCount: videoCount,
                files: [file],
                title: title,
                messages: messages,
                participants: participants,
                image: image,
            })
        }
    }

    // Sort messages
    threads.forEach((thread) => {
        thread.messages.sort((a, b) => a.timestamp_ms - b.timestamp_ms)
    })

    return threads
}

export {decodeFBString, parseMessage, collectThreads}