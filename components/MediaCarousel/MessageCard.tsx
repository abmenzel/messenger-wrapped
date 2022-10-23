import React from 'react'
import { message } from '../../types/fb'
import { decodeFBString } from '../../utils/messages'
import { epochToDate } from '../../utils/time'
import Label from '../Label'

const MessageCard = ({ message }: { message: message }) => {
	const date = epochToDate(message.timestamp_ms)
	return (
		<div>
			<div className='bg-white my-4 px-4 bg-opacity-10 flex text-center items-center overflow-auto w-full aspect-square justify-center'>
				<p>{message.content}</p>
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

export default MessageCard
