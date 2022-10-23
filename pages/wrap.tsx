import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect } from 'react'
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
import ThreadGrid from '../components/ThreadGrid'
import Upload from '../components/Upload'
import Layout from '../components/Layout/Layout'
import { StageName } from '../types/stages'
import InterfaceContext from '../context/interface'
import { Action, Status } from '../context/interface.types'
import { createAction } from '../context/interface.reducer'
import Confetti from '../components/Confetti'

const Wrap: NextPage = () => {
	const { state, dispatch, handleFileSelector } = useContext(InterfaceContext)
	const {
		threadExcerpt,
		threads,
		threadData,
		uploadStatus,
		abortedUpload,
		stageIndex,
		animateStageIndex,
		stage,
		animateStage,
		timer,
	} = state

	/*useEffect(() => {
		console.log()
		console.log('STAGE')
		console.log(stageIndex)
		console.log(stage)
		console.log(animateStageIndex)
		console.log(animateStage)
	})*/

	const wrapStart = 4

	const isActive = (stageName: StageName) =>
		stageIndex >= 0 &&
		stage?.name == stageName &&
		animateStage?.name == stageName

	/**
	 * The point which the actual wrap has started
	 * @returns whether or not wrap time has started
	 */
	const wrapTime = () => stageIndex > wrapStart - 1

	/**
	 * Initialize stage to 0 to make animation trigger
	 */
	useEffect(() => {
		dispatch(createAction(Action.setStageIndex, 0))
	}, [])

	/**
	 * Timer to go to the next stage once wrap time is started
	 */
	useEffect(() => {
		if (timer) clearTimeout(timer)
		if (!wrapTime()) return

		const nextStage = (stageIndex + 1) % stages.length
		const t = setTimeout(() => {
			dispatch(
				createAction(
					Action.setStageIndex,
					nextStage < wrapStart ? wrapStart : nextStage
				)
			)
		}, stage.time)
		dispatch(createAction(Action.setTimer, t))
	}, [stageIndex])

	useEffect(() => {
		dispatch(
			createAction(Action.setUploadStatus, {
				step: 0,
				message: Status.Empty,
			})
		)
		if (isActive(StageName.Pick)) {
			dispatch(createAction(Action.setThreadExcerpt, null))
		}
	}, [animateStage])

	return (
		<>
			<Head>
				<title>Messenger Wrapped | Pick messages</title>
				<meta name='description' content='Messenger Wrapped' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Layout>
				<FadeScale showIf={isActive(StageName.Upload)}>
					<Upload
						uploadStatus={uploadStatus}
						openFileSelector={handleFileSelector}
						abortedUpload={abortedUpload}
					/>
				</FadeScale>

				{isActive(StageName.Friends) && <Confetti />}
				<FadeScale showIf={isActive(StageName.Friends)}>
					<div className='flex h-full flex-col items-center p-4'>
						<p className={`big-title text-center`}>
							Woah that&apos;s a lot of friends!
						</p>
					</div>
				</FadeScale>

				<Fade showIf={isActive(StageName.Pick)}>
					<div className='w-full flex flex-col items-center my-6 px-6'>
						<Label className='mb-2'>Step 2</Label>
						<h1 className='big-title text-center mb-6'>
							Pick group
						</h1>
						<ThreadGrid threads={threads} />
					</div>
				</Fade>

				<FadeScale
					showIf={
						isActive(StageName.Collect) && threadExcerpt != null
					}>
					<div className='w-full flex flex-col items-center my-6 px-6 justify-center'>
						<Label className='mb-2'>{threadExcerpt?.title}</Label>
						<Progressbar
							max={
								threadExcerpt
									? threadExcerpt.files.length + 2
									: 2
							}
							step={uploadStatus.step}
							className='mt-4 w-48'
							text={
								uploadStatus.suffix
									? uploadStatus.message +
									  ' ' +
									  uploadStatus.suffix
									: uploadStatus.message
							}
						/>
					</div>
				</FadeScale>

				{wrapTime() && (
					<StageProgress
						className='absolute top-0'
						offset={wrapStart}
						stage={stageIndex}
						stages={stages}
						callback={(idx: number) => {
							dispatch(createAction(Action.setStageIndex, idx))
						}}
					/>
				)}

				<FadeScale showIf={wrapTime() && isActive(StageName.Intro)}>
					<IntroSlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(StageName.Counts)}>
					<CountSlide type={'messages'} thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(StageName.Timeline)}>
					<TimelineSlide thread={threadData} />
				</FadeScale>

				<FadeScale
					showIf={wrapTime() && isActive(StageName.TopContributors)}>
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

				<FadeScale
					showIf={wrapTime() && isActive(StageName.LongestMessages)}>
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

				<FadeScale showIf={wrapTime() && isActive(StageName.LixLevel)}>
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

				<FadeScale showIf={wrapTime() && isActive(StageName.Images)}>
					<PhotoMemorySlide thread={threadData} />
				</FadeScale>

				<FadeScale showIf={wrapTime() && isActive(StageName.Videos)}>
					<VideoMemorySlide thread={threadData} />
				</FadeScale>
			</Layout>
		</>
	)
}

export default Wrap
