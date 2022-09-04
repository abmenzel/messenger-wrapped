import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { message, thread, threadExcerpt } from '../types/fb'
import Label from '../components/Label'
import Progressbar from '../components/Progressbar'
import { Fade, FadeScale } from '../components/Animation'
import { ContributorsSlide, CountSlide, IntroSlide, MemorySlide, PhotoMemorySlide, TimelineSlide, VideoMemorySlide } from '../components/Slides'
import StageProgress from '../components/StageProgress'
import {
	collectThread,
	collectThreadExcerpts,
	messageCountReducer,
	messageLengthReducer,
} from '../utils/messages'
import { getAllFiles, nameToFile } from '../utils/files'
import ThreadGrid from '../components/ThreadGrid'
import Upload from '../components/Upload'
import Menu from '../components/Menu'

const Wrap: NextPage = () => {
	const [abortedUpload, setAbortedUpload] = useState(false)
	const [thread, setThread] = useState<threadExcerpt | null>(null)
	const [threadData, setThreadData] = useState<thread | null>(null)
	const [threads, setThreads] = useState<any[]>([])
	const [audioMap, setAudioMap] = useState<any>(null)
	const [imageMap, setImageMap] = useState<any>(null)
	const [videoMap, setVideoMap] = useState<any>(null)

	const [stage, setStage] = useState(-1)
	const [animateStage, setAnimateStage] = useState<number>(0)
	const [timer, setTimer] = useState<any>(null)
	const wrapStart = 4
	const stages = [
		{
			name: 'upload',
			time: 5000,
		},
		{
			name: 'lots-of-friends',
			time: 5000,
		},
		{
			name: 'pick',
			time: 5000,
		},
		{
			name: 'collect',
			time: 5000,
		},
		{
			name: 'intro',
			time: 4000,
		},
		{
			name: 'messageCount',
			time: 5000,
		},
		{
			name: 'timeline',
			time: 7000,
		},
		{
			name: 'topContributors',
			time: 7000,
		},
		{
			name: 'longestMessages',
			time: 7000,
		},
		{
			name: 'lixLevel',
			time: 7000,
		},
		{
			name: 'imageMemories',
			time: 8000,
		},
		{
			name: 'videoMemories',
			time: 25000,
		},
	]

	const moveOn = ['lots-of-friends']

	const activeStage = () => stages[stage]?.name

	const activeAnimatedStage = () => stages[animateStage]?.name

	const setStageByName = (stageName: string) =>
		setStage(stages.findIndex((elm) => elm.name == stageName))

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
		setStage(0)
	}, [])

	useEffect(() => {
		if (timer) clearTimeout(timer)
		if (!wrapTime()) {
			return
		}
		const nextStage = (stage + 1) % stages.length
		const t = setTimeout(() => {
			setStage(nextStage < wrapStart ? wrapStart : nextStage)
		}, stages[stage].time)
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
			setStageByName('lots-of-friends')
		} catch (error: any) {
			if (error instanceof DOMException) {
				console.log(error)
				setAbortedUpload(true)
			} else {
				console.log(error)
			}
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
		if (threads.length == 0) {
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
		console.log('thread loaded', threadData)
		if (threads.length == 0) {
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
		}, 300)
		if(moveOn.includes(stages[stage]?.name)){
			setTimeout(() => {
				setStage(stage + 1)
			}, 2000)
		}
	}, [stage])

	useEffect(() => {
		setUploadStatus({
			step: 0,
			message: '',
		})
		console.log('Can now animate stage', stages[animateStage])
		if (canShow('pick')) {
			setThread(null)
		}
	}, [animateStage])

	return (
		<div>
			<Head>
				<title>Messenger Wrapped | Pick messages</title>
				<meta name='description' content='Messenger Wrapped' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className='overflow-hidden flex flex-col items-center justify-center min-h-screen h-full bg-theme-primary text-theme-secondary'>
				<FadeScale showIf={canShow('upload')}>
					<Upload
						uploadStatus={uploadStatus}
						openFileSelector={openFileSelector}
						abortedUpload={abortedUpload}
					/>
				</FadeScale>

				<FadeScale showIf={canShow('lots-of-friends')}>
					<div className='flex flex-col items-center p-4'>
						<p className='big-title text-center'>Woah that's a lot of friends!</p>
					</div>
				</FadeScale>

				<Fade showIf={canShow('pick')}>
					<div className='w-full flex flex-col items-center my-6 px-6'>
						<Label className='mb-2'>Step 2</Label>
						<h1 className='big-title text-center mb-6'>
							Pick group
						</h1>
						<ThreadGrid data={threads} setThread={setThread} />
					</div>
				</Fade>

				<FadeScale showIf={canShow('collect') && thread != null}>
					<div className='w-full flex flex-col items-center my-6 px-6 justify-center'>
						<Label className='mb-2'>{thread?.title}</Label>
						<Progressbar
							max={thread ? thread.files.length + 2 : 2}
							step={uploadStatus.step}
							className='mt-4 w-48'
							text={uploadStatus.message}
						/>
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

				<FadeScale showIf={wrapTime() && canShow('timeline')}>
					<TimelineSlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('topContributors')}>
					<ContributorsSlide
						title={'Most messages'}
						text={'messages'}
						thread={threadData}
						values={
							threadData &&
							[...threadData.participants.entries()]
								.map(([name, data]) => {
									return {
										name: name,
										v: data.messageCount,
									}
								})
								.sort((a, b) => b.v - a.v)
						}
						total={threadData?.messageCount}
					/>
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('longestMessages')}>
					<ContributorsSlide
						title={'Longest messages'}
						text={'words on average'}
						thread={threadData}
						values={
							threadData &&
							[...threadData.participants.entries()]
								.map(([name, data]) => {
									return {
										name: name,
										v: data.averageWords,
									}
								})
								.sort((a, b) => b.v - a.v)
						}
					/>
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('lixLevel')}>
					<ContributorsSlide
						title={'Lix level'}
						text={'lix'}
						thread={threadData}
						values={
							threadData &&
							[...threadData.participants.entries()]
								.map(([name, data]) => {
									return {
										name: name,
										v: data.averageLixLevel,
									}
								})
								.sort((a, b) => b.v - a.v)
						}
					/>
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('imageMemories')}>
					<PhotoMemorySlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && canShow('videoMemories')}>
					<VideoMemorySlide thread={threadData} />
				</FadeScale>

				<Menu />

				<div className='flex justify-center bg-black w-full text-white uppercase text-xs py-2 fixed bottom-0'>
					<button
						className='w-1/2'
						onClick={() => {
							setStage(stage - 1)
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
