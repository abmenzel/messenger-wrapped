import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { thread, threadExcerpt } from '../types/fb'
import Label from '../components/Label'
import Progressbar from '../components/Progressbar'
import { Fade, FadeScale } from '../components/Animation'
import { stages } from '../config/stages'
import {
	ContributorsSlide,
	CountSlide,
	IntroSlide,
	PhotoMemorySlide,
	TimelineSlide,
	VideoMemorySlide,
} from '../components/Slides'
import StageProgress from '../components/StageProgress'
import {
	collectThread,
	collectThreadExcerpts,
} from '../utils/messages'
import { getAllFiles, nameToFile } from '../utils/files'
import ThreadGrid from '../components/ThreadGrid'
import Upload from '../components/Upload'
import Layout from '../components/Layout/Layout'
import { Stage } from '../types/stages'

const Wrap: NextPage = () => {
	const [abortedUpload, setAbortedUpload] = useState(false)
	const [thread, setThread] = useState<threadExcerpt | null>(null)
	const [threadData, setThreadData] = useState<thread | null>(null)
	const [threads, setThreads] = useState<any[]>([])
	const [audioMap, setAudioMap] = useState<any>(null)
	const [imageMap, setImageMap] = useState<any>(null)
	const [videoMap, setVideoMap] = useState<any>(null)

	const [stageIndex, setStageIndex] = useState(-1)
	const [animateStage, setAnimateStage] = useState<number>(0)
	const [timer, setTimer] = useState<any>(null)
	const wrapStart = 4

	const moveOn = [Stage.Friends]

	const activeStage = () => stages[stageIndex]?.name

	const activeAnimatedStage = () => stages[animateStage]?.name

	const setActiveStage = (stage: Stage) =>
		setStageIndex(stages.findIndex((elm) => elm.name == stage))

	const wrapTime = () => stageIndex > wrapStart - 1

	const isActive = (stage: Stage) =>
		activeStage() == stage && activeAnimatedStage() == stage

	const [uploadStatus, setUploadStatus] = useState<{
		step: number
		message: string
	}>({
		step: 0,
		message: 'Add data',
	})

	useEffect(() => {
		setStageIndex(0)
	}, [])

	useEffect(() => {
		if (timer) clearTimeout(timer)
		if (!wrapTime()) return
		
		const nextStage = (stageIndex + 1) % stages.length
		const t = setTimeout(() => {
			setStageIndex(nextStage < wrapStart ? wrapStart : nextStage)
		}, stages[stageIndex].time)
		setTimer(t)
	}, [stageIndex])

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
			const sorted = [...threads.values()].sort((a: threadExcerpt, b: threadExcerpt) => {
				return b.messageCount - a.messageCount
			})
			console.log(sorted)

			setThreads(sorted)
			setUploadStatus({
				step: 5,
				message: 'Ready',
			})
			setActiveStage(Stage.Friends)
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
		console.log(threadData)
		setThreadData(threadData)
	}

	useEffect(() => {
		if (threads.length == 0) return setActiveStage(Stage.Upload)
			
		if (thread != null) {
			handleThreadChange(thread)
			setActiveStage(Stage.Collect)
		} else {
			setActiveStage(Stage.Pick)
		}
	}, [thread])

	useEffect(() => {
		if (threads.length == 0) return setActiveStage(Stage.Upload)

		if (!threadData) return setActiveStage(Stage.Pick)
			
		setActiveStage(Stage.Intro)
	}, [threadData])

	useEffect(() => {
		setTimeout(() => {
			setAnimateStage(stageIndex)
		}, 300)
		if (moveOn.includes(stages[stageIndex]?.name)) {
			setTimeout(() => {
				setStageIndex(stageIndex + 1)
			}, 2000)
		}
	}, [stageIndex])

	useEffect(() => {
		setUploadStatus({
			step: 0,
			message: '',
		})
		if (isActive(Stage.Pick)) {
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
			<Layout setActiveStage={setActiveStage}>
				<FadeScale showIf={isActive(Stage.Upload)}>
					<Upload
						uploadStatus={uploadStatus}
						openFileSelector={openFileSelector}
						abortedUpload={abortedUpload}
					/>
				</FadeScale>

				<FadeScale showIf={isActive(Stage.Friends)}>
					<div className='flex flex-col items-center p-4'>
						<p className='big-title text-center'>
							Woah that&apos;s a lot of friends!
						</p>
					</div>
				</FadeScale>

				<Fade showIf={isActive(Stage.Pick)}>
					<div className='w-full flex flex-col items-center my-6 px-6'>
						<Label className='mb-2'>Step 2</Label>
						<h1 className='big-title text-center mb-6'>
							Pick group
						</h1>
						<ThreadGrid data={threads} setThread={setThread} />
					</div>
				</Fade>

				<FadeScale showIf={isActive(Stage.Collect) && thread != null}>
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
						stage={stageIndex}
						stages={stages}
						setStage={setStageIndex}
					/>
				)}

				<FadeScale showIf={wrapTime() && isActive(Stage.Intro)}>
					<IntroSlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(Stage.Counts)}>
					<CountSlide type={'messages'} thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(Stage.Timeline)}>
					<TimelineSlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(Stage.TopContributors)}>
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

				<FadeScale showIf={wrapTime() && isActive(Stage.LongestMessages)}>
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

				<FadeScale showIf={wrapTime() && isActive(Stage.LixLevel)}>
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

				<FadeScale showIf={wrapTime() && isActive(Stage.Images)}>
					<PhotoMemorySlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(Stage.Videos)}>
					<VideoMemorySlide thread={threadData} />
				</FadeScale>


			</Layout>
		</div>
	)
}

export default Wrap
