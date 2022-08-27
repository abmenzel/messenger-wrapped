import React, { useEffect, useState } from 'react'
import { thread } from '../types/fb'
import { epochToDate } from '../utils/time'
import CountUp from 'react-countup'
import Label from './Label'
import { FadeScale } from './Animation'
import { decodeFBString, getLixLevel, messageCountReducer } from '../utils/messages'

// INTRO -> The journey began in xxx ... In xxx you're still going strong
// MESSAGECOUNT -> xxxxx messages sent, how many more will come?
// MOST LIKED MESSAGES
// PHOTO COUNT
// MOST LIKED PHOTOS
// LYDTIMER
// MOST LIKED SOUNDS
// TOP CONTRIBUTORS
// LEAST CONTRIBUTORS
// LÆNGST BESKEDER
// LIX-TAL
// TIMELINE
//

const IntroSlide = (props: any) => {
	const { thread }: { thread: thread } = props
	const date = epochToDate(thread.messages[0].timestamp_ms)
	return (
		<div className='flex flex-col items-center'>
			<Label className='mb-2'>{thread.title}</Label>
			<p className='big-title text-center'>{`A journey that began in ${date.getFullYear()}`}</p>
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
		thread,
		total,
		reducer,
		title,
		text,
	}: {
		thread: thread
		total: number
		reducer: any
		title: string
		text: string
	} = props
	const contributors = thread.messages.reduce(reducer, new Map())
	const sorted = new Map(
		[...contributors.entries()].sort((a, b) => b[1] - a[1])
	)

	/*useEffect(() => {
		const lixLevels = thread.messages.reduce((acc: Map<string, number[]>, m) => {
			if (!m.content) return acc
			const lixLevel = getLixLevel(m.content)
			const prevValue = acc.get(m.sender_name)
			if(!prevValue){
				acc.set(m.sender_name, [lixLevel])
			}else{
				acc.set(m.sender_name, [...prevValue, lixLevel])
			}
			return acc
		},new Map())
	
		const averageLix = [...lixLevels.entries()].reduce((acc,[k,v]) => {
			const lixSum = v.reduce((acc, l) => acc + l,0)
			acc.set(k, lixSum / v.length)
			return acc
		},new Map())
	
		console.log(averageLix)
	}, [])*/
	

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
				{[...sorted.keys()].slice(0, 5).map((contributor, idx) => {
					const count = sorted.get(contributor)
					if (!count) {
						return <></>
					} else {
						return (
							<div className='mb-4' key={contributor}>
								<div
									className={`${animationDelay[idx]} animation-de animate-scaleIn opacity-0 scale-110 flex items-center gap-2 text-sm mb-1 relative left-4`}>
									<Label className='aspect-square items-center justify-center flex font-bold text-base w-14'>
										{Math.round((count / total) * 100)}%
									</Label>
									<div>
										<p className='font-bold text-lg'>
											{decodeFBString(contributor)}
										</p>
										<p className='text-sm'>
											{count.toLocaleString()} {text}
										</p>
									</div>
								</div>
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}

export { IntroSlide, CountSlide, ContributorsSlide }
