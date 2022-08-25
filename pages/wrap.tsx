import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { message, thread } from '../types/fb'
import Label from '../components/Label'
import Progressbar from '../components/Progressbar'
import { CSSTransition } from 'react-transition-group'
import { Fade, FadeScale } from '../components/Animation'
import { Intro } from '../components/Slides'
import StageProgress from '../components/StageProgress'

const Wrap: NextPage = () => {
	const [abortedUpload, setAbortedUpload] = useState(false)
	const [thread, setThread] = useState<thread | null>(null)
	const [threads, setThreads] = useState<any[]>([])
	const [step, setStep] = useState('upload')
	const [transitioning, setTransitioning] = useState(false)
	const [stage, setStage] = useState(0)
	const [timer, setTimer] = useState<any>(null)
	const stages = [
		'intro',
		'count',
		'top-contributors',
		'top-lix',
	]
	const [uploadStatus, setUploadStatus] = useState<{
		step: number
		message: string
	}>({
		step: 0,
		message: 'Add data',
	})

	useEffect(() => {
		console.log("stage", stage, stages[stage])
		if(step != 'wrap') {
			if(timer) clearTimeout(timer)
			return
		}
		const nextStage = (stage + 1) % stages.length
		const t = setTimeout(() => {
			setStage(nextStage)
		},5000)
		setTimer(t)
	}, [stage, step])

	const getAllFiles = async (
		directory: FileSystemDirectoryHandle
	): Promise<File[]> => {
		try {
			const allFilePromises: Promise<File>[] = []
			const findFiles = async (subdir: FileSystemDirectoryHandle) => {
				for await (const entry of subdir.values()) {
					if (entry.kind === 'file') {
						allFilePromises.push(entry.getFile())
					} else {
						await findFiles(entry)
					}
				}
			}
			await findFiles(directory)
			const allFiles: File[] = await Promise.all(allFilePromises)
			return allFiles
		} catch (err) {
			throw new Error('Error occured while reading directory')
		}
	}

	// TODO:
	// Error handling if no jsonfiles are found
	const openFileSelector = async () => {
		try {
			setAbortedUpload(false)
			const directory: FileSystemDirectoryHandle = await (
				window as any
			).showDirectoryPicker()
			console.log('Getting all files')
			setUploadStatus({
				step: 1,
				message: 'Getting all files',
			})
			const files = await getAllFiles(directory)
			//files.forEach((f) => console.log(f.type))
			const jsonFiles = files.filter((file: File) =>
				file.type.includes('json')
			)
			setUploadStatus({
				step: 2,
				message: 'Getting all images',
			})
			const imageFiles = files.filter((file: File) =>
				file.type.includes('image')
			)
			setUploadStatus({
				step: 3,
				message: 'Collecting chats',
			})
			const threads: Map<string, thread> = await collectThreads(
				jsonFiles,
				imageFiles
			)
			setUploadStatus({
				step: 4,
				message: 'Sorting chats',
			})
			const sorted = [...threads.values()].sort((a: any, b: any) => {
				return b.messageCount - a.messageCount
			})
			setThreads(sorted)
			setUploadStatus({
				step: 5,
				message: 'Ready',
			})
			setStep('pick')
		} catch (error: any) {
			if (error instanceof DOMException) {
				console.log(error)
				setAbortedUpload(true)
			} else {
				console.log(error)
			}
		}
	}

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

	const tryFindImage = (files: File[], imagePath: string): File | null => {
		const imagePathParts = imagePath.split('/')
		const fileName = imagePathParts[imagePathParts.length - 1]
		const match = files.find((img) => img.name == fileName)
		if (match) {
			return match
		} else {
			return null
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

	const ThreadGrid = (props: any) => {
		const { data } = props

		// TODO:
		// Sort message timestamps
		// Click group -> Start wrapped for group

		return (
			<div className='w-full grid grid-cols-2 gap-4 content-center'>
				{data?.map((thread: any, idx: number) => {
					return (
						<div
							onClick={() => {
								setThread(thread)
								setStep('wrap')
							}}
							key={thread.title + idx}
							className='w-full flex flex-col justify-center items-center relative'>
							<div className='w-28 mb-2 border border-theme-secondary aspect-square rounded-full flex flex-col text-center justify-center items-center'>
								{thread.image ? (
									<img
										loading='lazy'
										className='aspect-square rounded-full w-full'
										src={URL.createObjectURL(thread.image)}
										alt={thread.title}
									/>
								) : (
									<p className='text-theme-secondary'>?</p>
								)}
							</div>
							<Label className='absolute bottom-0 mb-4 min-w-[7rem] max-w-[9rem] text-ellipsis'>
								{thread.title}
							</Label>
						</div>
					)
				})}
			</div>
		)
	}

	const renderStep = () => {
		switch (uploadStatus.message) {
			case 'Add data':
			case 'Uploading files':
			case 'Getting all files':
			case 'Finding all images':
			case 'Collecting chats':
			case 'Sorting chats':
			case null:
				return (
					<div className='flex flex-col items-center'>
						<Label className='mb-2'>Step 1</Label>
						<h1 className='big-title text-center'>Upload data</h1>
						<div className='flex flex-col items-center justify-center'>
							<p className='sub-title text-center mt-2'>
								Note that uploaded data will not be stored or
								shared anywhere.
							</p>
							{uploadStatus.step == 0 ? (
								<button
									className='btn-primary my-6'
									onClick={openFileSelector}>
									{abortedUpload
										? 'Please add data'
										: 'Add data'}
								</button>
							) : (
								<div>
									<Progressbar
										max={5}
										step={uploadStatus.step}
										className='mt-4 w-48'
										text={uploadStatus.message}
									/>
								</div>
							)}
						</div>
					</div>
				)
			case 'Ready':
				return (
					<div className='w-full my-6 px-6'>
						<ThreadGrid data={threads} />
					</div>
				)
			default:
				return <div></div>
		}
	}

	return (
		<div>
			<Head>
				<title>Messenger Wrapped | Pick messages</title>
				<meta name='description' content='Messenger Wrapped' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='overflow-hidden flex flex-col items-center justify-center min-h-screen h-full bg-theme-primary text-theme-secondary'>
				{(step == 'pick' || step == 'upload') && !transitioning && renderStep()}
				{step == 'wrap' && <StageProgress className="absolute top-0" stage={stage} stages={stages} setStage={setStage}/>}
				<FadeScale showIf={step == 'wrap' && stages[stage] == 'intro'} pageTransition={true} setTransitioning={setTransitioning} >
					<Intro thread={thread} />
				</FadeScale>

				<button className="bg-black w-full text-white uppercase text-xs py-2 absolute bottom-0" onClick={() => {
					setStep('pick')
					setStage(0)
					}}>
							back
				</button>
			</div>
		</div>
	)
}

export default Wrap
