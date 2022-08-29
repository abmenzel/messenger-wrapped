type threadExcerpt = {
	title: string
	messageCount: number
	image: File | undefined
	files: File[]
}
type thread = {
	title: string
	messageCount: number
	videoCount: number
	audioSeconds: number
	photoCount: number
	participants: Map<string, participant>
	messages: message[]
	files: File[]
	image: File | undefined
}
type media = {
	file: File,
	reactions: string[]
}
type message = {
	timestamp_ms: number
	sender_name: string
	content?: string
	reactions: (string | undefined)[]
	photos: (File | undefined)[]
	audio: (File | undefined)[]
	videos: (File | undefined)[]
}
type participant = { 
	name: string
	totalLixLevel: number
	messageCount: number
	totalWords: number
	averageWords: number
	averageLixLevel: number
	longMessages: number
}

export type { message, thread, threadExcerpt, participant }
