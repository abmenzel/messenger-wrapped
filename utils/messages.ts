import { message, thread } from '../types/fb'
import { tryFindImage } from './files'

const decodeFBString = (str: any) => {
    let arr = []
    for (var i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i))
    }
    return Buffer.from(arr).toString('utf8')
}

const parseMessage = (message: any): message => {
    return {
        sender_name: message.sender_name ? message.sender_name : 'unknown',
        content: message.content
            ? decodeFBString(message.content)
            : 'no message',
        timestamp_ms: message.timestamp_ms,
    }
}

const collectThreads = async (
    files: File[],
    imageFiles: File[]
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
            (acc: any[], m: any) => [...acc, parseMessage(m)],
            []
        )
        const title: string = json.title
            ? decodeFBString(json.title)
            : 'unknown'
        const participants: string[] = json.participants.reduce(
            (acc: string[], p: string) => [...acc, p],
            []
        )
        const image: File | null = json.image
            ? tryFindImage(imageFiles, json.image.uri)
            : null

        if (threads.has(path)) {
            const prev: thread | undefined = threads.get(path)
            if (!prev) continue
            threads.set(path, {
                ...prev,
                messageCount: messageCount + prev.messageCount,
                files: [file, ...prev.files],
                title: title,
                messages: [...messages, ...prev.messages],
                participants: prev.participants,
            })
        } else {
            threads.set(path, {
                messageCount: messageCount,
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