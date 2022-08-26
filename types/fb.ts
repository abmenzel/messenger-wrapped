type thread = {
	title: string
	messageCount: number
	videoCount: number
	audioMinutes: number
	photoCount: number
	participants: string[]
	messages: message[]
	files: File[]
	image: File | undefined
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

export type { message, thread }
