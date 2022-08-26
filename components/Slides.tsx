import React, { useEffect, useState } from 'react'
import { thread } from '../types/fb'
import { epochToDate } from '../utils/time'
import CountUp from 'react-countup';
import Label from './Label'
import { FadeScale } from './Animation';

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
    const {thread} : {thread: thread} = props
    const date = epochToDate(thread.messages[0].timestamp_ms)
	return (
		<div className="flex flex-col items-center">
			<Label className="mb-2">{thread.title}</Label>
            <p className="big-title text-center">{`A journey that began in ${date.getFullYear()}`}</p>
		</div>
	)
}

const CountSlide = (props: any) => {
	const {thread, type} : {thread: thread, type: string} = props
	const [messagesDone, setMessagesDone] = useState(false)
	const [photosDone, setPhotosDone] = useState(false)
	return (
		<div className="flex flex-col items-center">
			<p className="big-title text-center">
				<CountUp end={thread.messageCount} duration={1} separator={"."} onEnd={() => setMessagesDone(true)}/>
			</p>
			<p className="sub-title text-center animate-scaleIn opacity-0 animation-delay-500">messages</p>
			<div className={`${messagesDone ? 'opacity-1' : 'opacity-0'} transition-all duration-500`}>
				<p className="big-title text-center mt-8">
					<CountUp end={thread.photoCount + thread.videoCount} duration={1} delay={1} separator={"."} onEnd={() => setPhotosDone(true)}/>
				</p>
				<p className="sub-title text-center animate-scaleIn opacity-0 animation-delay-1000">photos & videos</p>
			</div>
			<div className={`${photosDone ? 'opacity-1' : 'opacity-0'} transition-all duration-500`}>
				<p className="big-title text-center mt-8">
					<CountUp end={thread.messageCount} duration={1} delay={2} separator={"."} />
				</p>
				<p className="sub-title text-center animate-scaleIn opacity-0 animation-delay-2000">minutes of audio</p>
			</div>

		</div>
	)
}

export { IntroSlide, CountSlide }
