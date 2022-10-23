import React, { useEffect, useRef } from 'react'
import { message } from '../../types/fb'
import { decodeFBString } from '../../utils/messages'
import { epochToDate } from '../../utils/time'

const AudioCard = ({ message }: { message: message }) => {
	const date = epochToDate(message.timestamp_ms)
	const audioRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.play()
		}
	})

	return (
		<div>
			<div className='my-4 px-4 w-full aspect-video flex justify-center items-center'>
				{message.audio[0] && (
					<audio
						className=''
						ref={audioRef}
						src={URL.createObjectURL(message.audio[0])}
						controls={true}
					/>
				)}
			</div>
			<p>
				<span className='font-bold'>
					{decodeFBString(message.sender_name)}
				</span>{' '}
				sent this message on {date.toLocaleDateString()} at{' '}
				{date.toLocaleTimeString()}.
			</p>
			{message.reactions.length > 0 && (
				<p>It got {message.reactions.length} reactions.</p>
			)}
		</div>
	)
}

export default AudioCard
