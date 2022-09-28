import { thread, threadExcerpt } from "../types/fb"

export enum Action {
    setThreadExcerpt = 'setThreadExcerpt',
    setThreads = 'setThreads',
    setThreadData = 'setThreadData'
} 

export type InterfaceState = {
    threads: threadExcerpt[]
    threadExcerpt: null | threadExcerpt
    threadData: null | thread

}

export type Dispatch = (action: {type: Action, payload: any}) => void