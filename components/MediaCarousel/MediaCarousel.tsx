import { SliderUnstyled } from '@mui/base'
import { Slider } from '@mui/material'
import { ArrowLeft, ArrowLeftRight, ArrowRight } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import InterfaceContext from '../../context/interface'
import { message, thread } from '../../types/fb'
import MessageCard from './MessageCard'
import PhotoCard from './PhotoCard'

const MediaCarousel = ({ media, type }: { media: message[]; type: string }) => {
	const [mediaList, setMediaList] = useState(media)
	const [activeMediaIndex, setActiveMediaIndex] = useState(0)
	const [activeMedia, setActiveMedia] = useState(mediaList[0])
	const [sortBy, setSortBy] = useState('time')

	useEffect(() => {
		setActiveMedia(mediaList[activeMediaIndex])
	}, [mediaList, activeMediaIndex])

	const { state } = useContext(InterfaceContext)
	const { theme } = state

	const next = () => {
		const newIndex =
			activeMediaIndex + 1 >= mediaList.length ? 0 : activeMediaIndex + 1
		setActiveMediaIndex(newIndex)
	}

	const prev = () => {
		const newIndex =
			activeMediaIndex - 1 < 0
				? mediaList.length - 1
				: activeMediaIndex - 1
		setActiveMediaIndex(newIndex)
	}

	const toggleSort = () => {
		if (sortBy == 'time') {
			setSortBy('reactions')
			const newSortedMedia = mediaList.sort(
				(a, b) => b.reactions.length - a.reactions.length
			)
			setActiveMediaIndex(0)
			setActiveMedia(newSortedMedia[0])
			setMediaList(newSortedMedia)
		} else {
			setSortBy('time')
			const newSortedMedia = mediaList.sort(
				(a, b) => a.timestamp_ms - b.timestamp_ms
			)
			setActiveMediaIndex(0)
			setActiveMedia(newSortedMedia[0])
			setMediaList(newSortedMedia)
		}
	}

	return (
		<div className='px-4 w-full relative flex flex-col items-center mt-2'>
			<div className='mb-2' onClick={() => toggleSort()}>
				Sort by{' '}
				<span className='cursor-pointer font-bold inline-flex gap-x-1 items-center'>
					{sortBy} <ArrowLeftRight size={16} />
				</span>
			</div>
			<div className='flex gap-x-2'>
				<div
					onClick={() => prev()}
					className={`cursor-pointer rounded-full p-1 inline-flex ${theme.bgSecondary} ${theme.textPrimary}`}>
					<ArrowLeft size={16} />
				</div>
				<p>
					{activeMediaIndex + 1} out of {mediaList.length}
				</p>
				<div
					onClick={() => next()}
					className={`cursor-pointer rounded-full p-1 inline-flex ${theme.bgSecondary} ${theme.textPrimary}`}>
					<ArrowRight size={16} />
				</div>
			</div>
			<SliderUnstyled
				componentsProps={{
					root: {
						className:
							'w-full relative inline-block cursor-pointer my-6',
					},
					track: {
						className: `${theme.bgSecondary} h-2 absolute rounded-full`,
					},
					thumb: {
						className: `w-6 h-6 -mt-2 text-transparent -ml-2 flex items-center justify-center ${theme.bgSecondary} rounded-full absolute`,
					},
					rail: {
						className: `${theme.bgSecondary} opacity-25 h-2 w-full rounded-full block absolute`,
					},
				}}
				onChange={(e, v) => {
					if (!Array.isArray(v)) {
						setActiveMediaIndex(v)
					}
				}}
				valueLabelDisplay={'auto'}
				max={mediaList.length - 1}
				defaultValue={0}
			/>
			<div className='w-full aspect-square'>
				{type == 'messages' && <MessageCard message={activeMedia} />}
				{type == 'photos' && <PhotoCard message={activeMedia} />}
			</div>
		</div>
	)
}

export default MediaCarousel
