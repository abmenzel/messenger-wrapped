import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { message, thread, threadExcerpt } from '../types/fb'
import Label from '../components/Label'
import Progressbar from '../components/Progressbar'
import { CSSTransition } from 'react-transition-group'
import { Fade, FadeScale } from '../components/Animation'
import { ContributorsSlide, CountSlide, IntroSlide } from '../components/Slides'
import StageProgress from '../components/StageProgress'
import {
	collectThread,
	collectThreadExcerpts,
	messageCountReducer,
	messageLengthReducer,
} from '../utils/messages'
import { getAllFiles, nameToFile } from '../utils/files'
import ThreadGrid from '../components/ThreadGrid'

const Wrap: NextPage = () => {
	const [abortedUpload, setAbortedUpload] = useState(false)
	const [thread, setThread] = useState<threadExcerpt | null>(null)
	const [threadData, setThreadData] = useState<thread | null>(null)
	const [threads, setThreads] = useState<any[]>([])
	const [audioMap, setAudioMap] = useState<any>(null)
	const [imageMap, setImageMap] = useState<any>(null)
	const [videoMap, setVideoMap] = useState<any>(null)

	const [stage, setStage] = useState(0)
	const [animateStage, setAnimateStage] = useState<number>(0)
	const [timer, setTimer] = useState<any>(null)
	const wrapStart = 3
	const stages = [
		'upload',
		'pick',
		'collect',
		'intro',
		'messageCount',
		'topContributors',
		'longestMessages',
	]

	const activeStage = () => stages[stage]

	const activeAnimatedStage = () => stages[animateStage]

	const setStageByName = (stageName: string) =>
		setStage(stages.findIndex((elm) => elm == stageName))

	const wrapTime = () => stage > wrapStart - 1

	const canShow = (stageName: string) =>
		activeStage() == stageName && activeAnimatedStage() == stageName

	const [uploadStatus, setUploadStatus] = useState<{
		step: number
		message: string
	}>({
		step: 0,
		message: 'Add data',
	})

	useEffect(() => {
		if (timer) clearTimeout(timer)
		if (!wrapTime()) {
			return
		}
		const nextStage = (stage + 1) % stages.length
		const t = setTimeout(() => {
			setStage(nextStage < wrapStart ? wrapStart : nextStage)
		}, 5000)
		setTimer(t)
	}, [stage])

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
				message: 'Getting all media',
			})
			const imageFiles = files.filter((file: File) =>
				file.type.includes('image')
			)

			const videoFiles = files.filter((file: File) =>
				file.type.includes('video')
			)

			const imageMap = imageFiles.reduce(nameToFile, new Map())

			const audioMap = videoFiles.reduce(nameToFile, new Map()) // Audio files are .mp4 files

			const videoMap = videoFiles.reduce(nameToFile, new Map())

			setImageMap(imageMap)
			setAudioMap(audioMap)
			setVideoMap(videoMap)

			setUploadStatus({
				step: 3,
				message: 'Collecting chats',
			})
			const threads: Map<string, threadExcerpt> =
				await collectThreadExcerpts(jsonFiles, imageMap)
			setUploadStatus({
				step: 4,
				message: 'Sorting chats',
			})
			const sorted = [...threads.values()].sort((a: any, b: any) => {
				return b.messageCount - a.messageCount
			})
			console.log(sorted)

			setThreads(sorted)
			setUploadStatus({
				step: 5,
				message: 'Ready',
			})
			setStageByName('pick')
		} catch (error: any) {
			if (error instanceof DOMException) {
				console.log(error)
				setAbortedUpload(true)
			} else {
				console.log(error)
			}
		}
	}

	const renderStep = () => {
		switch (uploadStatus.message) {
			case 'Add data':
			case 'Uploading files':
			case 'Getting all files':
			case 'Finding all media':
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
			default:
				return <div></div>
		}
	}

	const handleThreadChange = async (thread: threadExcerpt) => {
		const threadData = await collectThread(
			thread,
			imageMap,
			audioMap,
			videoMap,
			setUploadStatus
		)
		setThreadData(threadData)
	}

	useEffect(() => {
		if(threads.length == 0){
			setStageByName('upload')
			return
		}
		if (thread != null) {
			handleThreadChange(thread)
			setStageByName('collect')
		} else {
			setStageByName('pick')
		}
	}, [thread])

	useEffect(() => {
		if(threads.length == 0){
			setStageByName('upload')
			return
		}
		if (!threadData) {
			setStageByName('pick')
			return
		}
		setStageByName('intro')

	}, [threadData])

	useEffect(() => {
		console.log('Switched to stage', stages[stage])
		setTimeout(() => {
			setAnimateStage(stage)
		}, 500)
	}, [stage])

	useEffect(() => {
		console.log('Can now animate stage', stages[animateStage])
		if (stages[animateStage] == 'pick') {
			setThread(null)
		}
	}, [animateStage])

	const nextStage = () => {
		console.log('going to next stage')
		setStage((stage + 1) % stages.length)
	}

	return (
		<div>
			<Head>
				<title>Messenger Wrapped | Pick messages</title>
				<meta name='description' content='Messenger Wrapped' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='overflow-hidden flex flex-col items-center justify-center min-h-screen h-full bg-theme-primary text-theme-secondary'>
				{activeStage() == 'upload' && renderStep()}
				<FadeScale showIf={canShow('collect') && thread != null}>
					<div className='w-full my-6 px-6 flex justify-center'>
						<Progressbar
							max={thread ? thread.files.length + 2 : 2}
							step={uploadStatus.step}
							className='mt-4 w-48'
							text={uploadStatus.message}
						/>{' '}
					</div>
				</FadeScale>
				<FadeScale showIf={canShow('pick')}>
					<div className='w-full my-6 px-6'>
						<ThreadGrid data={threads} setThread={setThread} />
					</div>
				</FadeScale>

				{wrapTime() && (
					<StageProgress
						className='absolute top-0'
						offset={wrapStart}
						stage={stage}
						stages={stages}
						setStage={setStage}
					/>
				)}

				<FadeScale showIf={wrapTime() && canShow('intro')}>
					<IntroSlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('messageCount')}>
					<CountSlide type={'messages'} thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('topContributors')}>
					<ContributorsSlide
						total={threadData?.messageCount}
						reducer={messageCountReducer}
						title={'Most messages'}
						text={'messages'}
						thread={threadData}
					/>
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('longestMessages')}>
					<ContributorsSlide
						total={threadData?.messages.reduce((acc, m) => {
							return (m.content ? m.content.length : 0) + acc
						}, 0)}
						reducer={messageLengthReducer}
						title={'Longest messages'}
						text={'characters'}
						thread={threadData}
					/>
				</FadeScale>
				<div className='flex justify-center bg-black w-full text-white uppercase text-xs py-2 absolute bottom-0'>
					<button
						className='w-1/2'
						onClick={() => {
							setStageByName('pick')
						}}>
						back
					</button>
					<button
						className='w-1/2'
						onClick={() => {
							clearTimeout(timer)
						}}>
						pause
					</button>
				</div>
			</div>
		</div>
	)
}

export default Wrap
