type thread = {
	title: string
	messageCount: number
	participants: string[]
	messages: message[]
	files: File[]
	image: File | null
}
type message = {
	timestamp_ms: number
	sender_name: string
	content?: string
}

export type { message, thread }
