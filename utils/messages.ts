import { createAction } from '../context/interface.reducer'
import { Action, Dispatch, Status } from '../context/interface.types'
import { message, participant, thread, threadExcerpt } from '../types/fb'
import { tryFindFile, tryFindFiles } from './files'
import { epochToDate } from './time'

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

const getNumberOfWords = (message: string) => {
	const words = message.split(' ')
	const numberOfWords = words.length > 0 ? words.length : 1
	return numberOfWords
}

const getLixLevel = (message: string) => {
	if (message.length < 50) return 0
	const words = message.split(' ')
	const numberOfWords = words.length > 0 ? words.length : 1
	const periodMatches = message.match(/\./g)
	const periods = periodMatches
		? periodMatches.length > 1
			? periodMatches.length
			: 1
		: 1
	const longWords = words.reduce((acc: number, w: string) => {
		if (w.length > 6) {
			return acc + 1
		} else {
			return acc
		}
	}, 0)
	const lixLevel = numberOfWords / periods + (longWords * 100) / numberOfWords
	console.log('lix', lixLevel)
	return lixLevel
}

const parseMessage = (
	message: any,
	imageMap: Map<string, File>,
	audioMap: Map<string, File>,
	videoMap: Map<string, File>
): message => {
	return {
		sender_name: message.sender_name ? message.sender_name : 'unknown',
		content: message.content
			? decodeFBString(message.content)
			: 'no message',
		timestamp_ms: message.timestamp_ms,
		reactions: message.reactions
			? message.reactions.map((r: any) => r.reaction)
			: [],
		photos: message.photos
			? tryFindFiles(
					imageMap,
					message.photos.map((p: any) => p.uri)
			  )
			: [],
		videos: message.videos
			? tryFindFiles(
					videoMap,
					message.videos.map((v: any) => v.uri)
			  )
			: [],
		audio: message.audio_files
			? tryFindFiles(
					audioMap,
					message.audio_files.map((a: any) => a.uri)
			  )
			: [],
	}
}

const getPromiseFromEvent = (item: any, event: any): Promise<number> => {
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
		if (!(json.participants?.length > 1) || !json.messages || !json.title)
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
	dispatch: Dispatch
): Promise<thread> => {
	const thread: thread = {
		messageCount: threadExcerpt.messageCount,
		messageBucket: new Map(),
		busiestMonth: {
			date: '',
			count: 0,
		},
		audioSeconds: 0,
		photoCount: 0,
		videoCount: 0,
		files: threadExcerpt.files,
		title: threadExcerpt.title,
		messages: [],
		participants: new Map(),
		image: threadExcerpt.image,
	}

	// Create thread map
	for await (const [idx, file] of threadExcerpt.files.entries()) {
		dispatch(
			createAction(Action.setUploadStatus, {
				step: idx,
				message: Status.GettingAllMessagesInFile,
				suffix: idx.toString(),
			})
		)

		const content = await file.text()
		const json = await JSON.parse(content)
		if (!(json.participants?.length > 1) || !json.messages || !json.title)
			continue

		const messages: message[] = json.messages.reduce(
			(acc: message[], m: any) => [
				...acc,
				parseMessage(m, imageMap, audioMap, videoMap),
			],
			[]
		)

		const photoCount = messages.reduce((acc: number, m) => {
			return acc + m.photos.length
		}, 0)
		const videoCount = messages.reduce((acc: number, m) => {
			return acc + m.videos.length
		}, 0)

		let audSeconds = 0

		const participants: Map<string, participant> = new Map()

		for await (const m of messages) {
			for await (const audio of m.audio) {
				if (audio != undefined) {
					const audioUrl = URL.createObjectURL(audio)
					const audioElm = new Audio(audioUrl)
					const duration = await getPromiseFromEvent(
						audioElm,
						'loadedmetadata'
					).then((duration) => {
						return duration
					})
					audSeconds += duration
				}
			}

			// Update participant
			const prevValue = participants.get(m.sender_name)
			if (prevValue) {
				participants.set(m.sender_name, {
					...prevValue,
					messageCount: prevValue.messageCount + 1,
					longMessages:
						prevValue.longMessages +
						(m.content && m.content.length > 50 ? 1 : 1),
					totalLixLevel:
						prevValue.totalLixLevel +
						(m.content ? getLixLevel(m.content) : 0),
					totalWords:
						prevValue.totalWords +
						(m.content ? getNumberOfWords(m.content) : 0),
				})
			} else {
				participants.set(m.sender_name, {
					name: m.sender_name,
					messageCount: 1,
					longMessages: m.content && m.content.length > 50 ? 1 : 1,
					totalLixLevel: m.content ? getLixLevel(m.content) : 0,
					totalWords: m.content ? getNumberOfWords(m.content) : 0,
					averageWords: 0,
					averageLixLevel: 0,
				})
			}
		}
		thread.audioSeconds = thread.audioSeconds + audSeconds
		thread.videoCount = thread.videoCount + videoCount
		thread.photoCount = thread.photoCount + photoCount
		thread.messages = [...thread.messages, ...messages]

		// Update participants
		;[...participants.entries()].forEach(([name, data]) => {
			const prevValue = thread.participants.get(name)
			if (prevValue) {
				thread.participants.set(name, {
					name: name,
					messageCount: prevValue.messageCount + data.messageCount,
					longMessages: prevValue.longMessages + data.longMessages,
					totalLixLevel: prevValue.totalLixLevel + data.totalLixLevel,
					totalWords: prevValue.totalWords + data.totalWords,
					averageWords: 0,
					averageLixLevel: 0,
				})
			} else {
				thread.participants.set(name, {
					name: name,
					messageCount: data.messageCount,
					longMessages: data.longMessages,
					totalLixLevel: data.totalLixLevel,
					totalWords: data.totalWords,
					averageWords: 0,
					averageLixLevel: 0,
				})
			}
		})
	}

	dispatch(
		createAction(Action.setUploadStatus, {
			step: threadExcerpt.files.length + 1,
			message: Status.SortingMessages,
		})
	)

	thread.participants.forEach((value, key) => {
		thread.participants.set(key, {
			...value,
			averageLixLevel: Math.round(
				value.totalLixLevel / value.longMessages
			),
			averageWords: Math.round(value.totalWords / value.messageCount),
		})
	})
	// Sort messages
	thread.messages.sort((a, b) => a.timestamp_ms - b.timestamp_ms)

	// Create message bucket
	const messageBucket: Map<
		number,
		Map<number, number>
	> = thread.messages.reduce(
		(acc: Map<number, Map<number, number>>, message) => {
			const date = epochToDate(message.timestamp_ms)
			const month = date.getMonth()
			const year = date.getFullYear()
			const prevValue = acc.get(year)
			if (prevValue) {
				const prevYearValue = prevValue.get(month)
				if (prevYearValue) {
					prevValue.set(month, prevYearValue + 1)
				} else {
					prevValue.set(month, 1)
				}
			} else {
				acc.set(year, new Map().set(month, 1))
			}
			return acc
		},
		new Map()
	)

	const messageBucketSorted = new Map(
		[...messageBucket.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([year, map]) => {
				return [year, new Map([...map].sort((a, b) => b[0] - a[0]))]
			})
	)

	let busiestMonth = {
		date: '',
		count: 0,
	}
	const entries = [...messageBucket.entries()]
	entries.forEach(([year, yearCounts]) => {
		const yearEntries = [...yearCounts.entries()]
		yearEntries.forEach(([month, count]) => {
			if (count > busiestMonth.count) {
				busiestMonth.count = count
				busiestMonth.date = `${year}.${month}`
			}
		})
	})

	thread.messageBucket = messageBucketSorted
	thread.busiestMonth = busiestMonth

	dispatch(
		createAction(Action.setUploadStatus, {
			step: threadExcerpt.files.length + 2,
			message: Status.Ready,
		})
	)

	return thread
}

export {
	decodeFBString,
	parseMessage,
	collectThreadExcerpts,
	collectThread,
	messageCountReducer,
	messageLengthReducer,
	getLixLevel,
}
