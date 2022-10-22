import { ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useContext, useState } from 'react'
import InterfaceContext from '../../context/interface'
import { message, thread } from '../../types/fb'
import MessageCard from './MessageCard'

const MediaCarousel = ({ media }: { media: message[] }) => {
	const [mediaList, setMediaList] = useState(media)
	const [activeMedia, setActiveMedia] = useState(media[0])
	const { state } = useContext(InterfaceContext)
	const { theme } = state
	return (
		<div className='w-full relative flex items-center'>
			<div
				className={`absolute left-0 rounded-full p-2 inline-flex ${theme.bgSecondary} ${theme.textPrimary}`}>
				<ArrowLeft size={20} />
			</div>
			<div
				className={`absolute right-0 rounded-full p-2 inline-flex ${theme.bgSecondary} ${theme.textPrimary}`}>
				<ArrowRight size={20} />
			</div>
			<div className='w-full px-4 aspect-square'>
				<MessageCard message={activeMedia} />
			</div>
		</div>
	)
}

export default MediaCarousel
