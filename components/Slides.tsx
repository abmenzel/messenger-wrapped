import React, { useEffect, useRef, useState } from 'react'
import { message, thread } from '../types/fb'
import { epochToDate, getWeek } from '../utils/time'
import CountUp from 'react-countup'
import Label from './Label'
import { FadeScale } from './Animation'
import {
	decodeFBString,
} from '../utils/messages'
import Image from 'next/image'

const IntroSlide = (props: any) => {
	const { thread }: { thread: thread } = props
	const date = epochToDate(thread.messages[0].timestamp_ms)
	return (
		<div className='flex flex-col items-center'>
			<Label className='mb-2'>{thread.title}</Label>
			<p className='big-title text-center mb-4'>{`A journey that began in ${date.getFullYear()}`}</p>
			<p className='sub-title text-center'>
				{thread.messages[0].content}
			</p>
			<p className='sub-title text-center'>
				- {decodeFBString(thread.messages[0].sender_name)}
			</p>
		</div>
	)
}

const TimelineSlide = (props: any) => {
	const { thread }: { thread: thread } = props
	return (
		<div className='relative px-6'>
			<div className='flex items-center justify-start flex-col'>
				<p className='big-title mb-2 text-center'>Over the years</p>
				<p className='sub-title text-center mb-2'>
					What will the future look like?
				</p>
				<div className='w-full'>
					{[...thread.messageBucket.entries()].map(
						([year, months],idx) => {
							return (
								<div key={`year-${idx}`} className=' flex flex-col mb-2'>
									<p className='text-theme-1-secondary font-extrabold text-xl'>
										{year}
									</p>
									{[...months.values()].map((count, idx) => {
										return (
											<div key={`months-${idx}`} className='flex w-full justify-start items-center'>
												<div
													className='h-0.5'
													style={{
														width: `${
															(count /
																thread
																	.busiestMonth
																	.count) *
															100
														}%`,
													}}>
													<div
														style={{
															animationDuration:
																'2s',
															animationFillMode:
																'forwards',
														}}
														className={`h-full bg-theme-1-secondary animate-width w-0`}
													/>
												</div>
											</div>
										)
									})}
								</div>
							)
						}
					)}
				</div>
			</div>
		</div>
	)
}

const CountSlide = (props: any) => {
	const { thread, type }: { thread: thread; type: string } = props
	const [messagesDone, setMessagesDone] = useState(false)
	const [photosDone, setPhotosDone] = useState(false)
	return (
		<div className='flex flex-col items-center'>
			<p className='big-title text-center'>
				<CountUp
					end={thread.messageCount}
					duration={1}
					separator={'.'}
					onEnd={() => setMessagesDone(true)}
				/>
			</p>
			<p className='sub-title text-center animate-scaleIn opacity-0 animation-delay-500'>
				messages
			</p>
			<div
				className={`${
					messagesDone ? 'opacity-1' : 'opacity-0'
				} transition-all duration-500`}>
				<p className='big-title text-center mt-8'>
					<CountUp
						end={thread.photoCount + thread.videoCount}
						duration={1}
						delay={1}
						separator={'.'}
						onEnd={() => setPhotosDone(true)}
					/>
				</p>
				<p className='sub-title text-center animate-scaleIn opacity-0 animation-delay-1000'>
					photos & videos
				</p>
			</div>
			<div
				className={`${
					photosDone ? 'opacity-1' : 'opacity-0'
				} transition-all duration-500`}>
				<p className='big-title text-center mt-8'>
					<CountUp
						end={Math.ceil(thread.audioSeconds / 60)}
						duration={1}
						delay={2}
						separator={'.'}
					/>
				</p>
				<p className='sub-title text-center animate-scaleIn opacity-0 animation-delay-2000'>
					minutes of sound
				</p>
			</div>
		</div>
	)
}

const ContributorsSlide = (props: any) => {
	const {
		total,
		values,
		title,
		text,
	}: {
		values: { name: string; v: number }[]
		total?: number
		reducer: any
		title: string
		text: string
	} = props

	const animationDelay = [
		'animation-delay-200',
		'animation-delay-400',
		'animation-delay-600',
		'animation-delay-800',
		'animation-delay-1000',
	]

	return (
		<div className='flex flex-col items-center'>
			<p className='big-title text-center mb-4'>{title}</p>
			<div className='text-left'>
				{values
					.slice(0, 5)
					.map((value: { name: string; v: number }, idx: number) => {
						return (
							<div className='mb-4' key={value.name}>
								<div
									className={`${animationDelay[idx]} animate-scaleIn opacity-0 scale-110 flex items-center gap-2 text-sm mb-1 relative left-4`}>
									<Label className='aspect-square items-center justify-center flex font-bold text-base w-14'>
										{total
											? `${Math.round(
													(value.v / total) * 100
											  )}%`
											: idx + 1}
									</Label>
									<div>
										<p className='font-bold text-lg'>
											{decodeFBString(value.name)}
										</p>
										<p className='text-sm'>
											{value.v.toLocaleString()} {text}
										</p>
									</div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

const PhotoMemorySlide = (props: any) => {
	const { thread }: { thread: thread } = props
	const [mediaUrls, setMediaUrls] = useState<string[]>([])

	useEffect(() => {
		const urls = thread.messages
			.filter((m) => m.photos.length > 0 && m.photos[0] != undefined)
			.sort((a, b) => b.reactions.length - a.reactions.length)
			.slice(0, 10)
			.map((m) => URL.createObjectURL(m.photos[0] as File))
		setMediaUrls(urls)
	}, [])

	return (
		<div className='flex h-screen flex-col items-center px-6'>
			<p className='sub-title text-center mt-24 mb-12'>{`You've shared so many memories together`}</p>
			<div className='w-full h-1/2 relative'>
				{mediaUrls.length > 0 &&
					mediaUrls.map((url, idx) => {
						return (
							<div
								style={{
									animationDelay: `${1000 * idx}ms`,
									zIndex: `${1 * idx}`,
								}}
								className='overflow-visible absolute inset-0 w-full animate-scaleIn opacity-0 scale-110'
								key={idx}>
								{url && (
									<div
										className='absolute inset-0 px-6 w-4/5 mx-auto'
										style={{
											overflow: 'visible',
											transform: `rotate(${
												idx % 2 == 0 ? idx : -idx
											}deg)`,
										}}>
										<Image
											layout='fill'
											objectFit='contain'
											src={url}
											alt=''
										/>
									</div>
								)}
							</div>
						)
					})}
			</div>
		</div>
	)
}

const VideoMemorySlide = (props: any) => {
	const { thread }: { thread: thread } = props
	const [mediaUrls, setMediaUrls] = useState<string[]>([])
	const videoRef = useRef<(HTMLVideoElement | null)[]>([])
	const [playingVideo, setPlayingVideo] = useState(0)
	useEffect(() => {
		const videoUrls = thread.messages
			.filter((m) => m.videos.length > 0 && m.videos[0] != undefined)
			.sort((a, b) => b.reactions.length - a.reactions.length)
			.slice(0, 10)
			.map((m) => URL.createObjectURL(m.videos[0] as File))
		setMediaUrls(videoUrls)

		return
	}, [])

	useEffect(() => {
		if (mediaUrls.length == 0) return
		const activeVideo = videoRef.current[playingVideo]

		if (!activeVideo) return
		activeVideo.play()
		setTimeout(() => {
			activeVideo.pause()
			setPlayingVideo(playingVideo + 1)
		}, 2500)
	}, [playingVideo, mediaUrls])

	return (
		<div className='flex h-screen flex-col items-center px-6'>
			<p className='sub-title text-center mt-24 mb-12'>{`You've shared so many memories together`}</p>
			<div className='w-full h-1/2 relative'>
				{mediaUrls.length > 0 &&
					mediaUrls.map((url, idx) => {
						return (
							<div
								style={{
									animationDelay: `${2500 * idx}ms`,
									zIndex: `${1 * idx}`,
								}}
								className='overflow-visible absolute inset-0 w-full animate-scaleIn opacity-0 scale-110'
								key={idx}>
								{url && (
									<div
										className='absolute flex items-center inset-0 px-6 w-4/5 mx-auto'
										style={{
											overflow: 'visible',
											transform: `rotate(${
												idx % 2 == 0 ? idx : -idx
											}deg)`,
										}}>
										<video
											ref={(el) =>
												(videoRef.current[idx] = el)
											}
											src={url}
										/>
									</div>
								)}
							</div>
						)
					})}
			</div>
		</div>
	)
}

export {
	IntroSlide,
	CountSlide,
	ContributorsSlide,
	PhotoMemorySlide,
	VideoMemorySlide,
	TimelineSlide,
}
