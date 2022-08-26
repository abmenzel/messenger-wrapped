import React from 'react'
import { thread } from '../types/fb'
import { epochToDate } from '../utils/time'
import Label from './Label'

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

const Intro = (props: any) => {
    const {thread} : {thread: thread} = props
    if(!thread) return <div>test</div>
    const date = epochToDate(thread.messages[0].timestamp_ms)
	return (
		<div className="flex flex-col items-center">
			<Label className="mb-2">{thread?.title}</Label>
            <p className="big-title text-center">{`A journey that began in ${date.getFullYear()}`}</p>
		</div>
	)
}

export { Intro }
