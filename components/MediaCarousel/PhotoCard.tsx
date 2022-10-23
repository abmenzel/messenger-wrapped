import Image from 'next/image'
import React from 'react'
import { message } from '../../types/fb'
import { decodeFBString } from '../../utils/messages'
import { epochToDate } from '../../utils/time'
import Label from '../Label'

const PhotoCard = ({ message }: { message: message }) => {
	const date = epochToDate(message.timestamp_ms)
	return (
		<div>
			<div className='my-4 px-4 w-full'>
				<Image
					src={URL.createObjectURL(message.photos[0] as File)}
					alt=''
					objectFit='contain'
					objectPosition={'center'}
					width={200}
					height={200}
					layout='responsive'
				/>
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

export default PhotoCard
