import { thread, threadExcerpt } from '../types/fb'
import { Stage } from '../types/stages'
import { Theme } from './interface.theme'

export enum Action {
	setThreadExcerpt = 'setThreadExcerpt',
	setThreads = 'setThreads',
	setThreadData = 'setThreadData',
	setUploadStatus = 'setUploadStatus',
	setAbortedUpload = 'setAbortedUpload',
	setAudioMap = 'setAudioMap',
	setVideoMap = 'setVideoMap',
	setImageMap = 'setImageMap',
	setStageIndex = 'setStageIndex',
	setAnimateStageIndex = 'setAnimateStageIndex',
	setStageByName = 'setStageByName',
	setAnimateStageByName = 'setAnimateStageByName',
	setTimer = 'setTimer',
	setTheme = 'setTheme',
}

export enum Status {
	Empty = '',
	Ready = 'Ready',
	AddData = 'Add data',
	GettingAllFiles = 'Getting all files',
	GettingAllMessagesInFile = 'Getting all messages in file',
	GettingAllMedia = 'Getting all media',
	CollectingChats = 'Collecting chats',
	SortingChats = 'Sorting chats',
	SortingMessages = 'Sorting messages',
}

export type LoadStatus = {
	step: number
	message: Status
	suffix?: string
}

export type InterfaceState = {
	threads: threadExcerpt[]
	threadExcerpt: null | threadExcerpt
	threadData: null | thread
	uploadStatus: LoadStatus
	abortedUpload: boolean
	imageMap: null | Map<string, File>
	audioMap: null | Map<string, File>
	videoMap: null | Map<string, File>
	stageIndex: number
	animateStageIndex: number
	stage: Stage
	animateStage: Stage
	timer: null | NodeJS.Timeout
	theme: Theme
}

export type Dispatch = (action: { type: Action; payload: any }) => void
