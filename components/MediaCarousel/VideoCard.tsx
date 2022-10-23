import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { message } from '../../types/fb'
import { decodeFBString } from '../../utils/messages'
import { epochToDate } from '../../utils/time'
import Label from '../Label'

const VideoCard = ({ message }: { message: message }) => {
	const date = epochToDate(message.timestamp_ms)
	const videoRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.play()
		}
	})

	return (
		<div>
			<div className='my-4 px-4 w-full aspect-square flex justify-center items-center'>
				{message.videos[0] && (
					<video
						className='h-full'
						ref={videoRef}
						src={URL.createObjectURL(message.videos[0])}
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

export default VideoCard
