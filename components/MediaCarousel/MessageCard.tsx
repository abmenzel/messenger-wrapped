import React from 'react'
import { message } from '../../types/fb'
import { epochToDate } from '../../utils/time'
import Label from '../Label'

const MessageCard = ({ message }: { message: message }) => {
	return (
		<div>
			<div className='bg-white my-4 bg-opacity-10 flex text-center items-center overflow-auto w-full aspect-square justify-center'>
				<p>{message.content}</p>
			</div>
			<p>
				<span className='font-bold'>{message.sender_name}</span> sent
				this message on{' '}
				{epochToDate(message.timestamp_ms).toLocaleDateString()}.
			</p>
			{message.reactions.length > 0 && (
				<p>It got {message.reactions.length} reactions.</p>
			)}
		</div>
	)
}

export default MessageCard
