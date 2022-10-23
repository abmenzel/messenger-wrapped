import Head from 'next/head'
import React, { useContext } from 'react'
import ExploreCheck from '../../components/ExploreCheck'
import Label from '../../components/Label'
import Layout from '../../components/Layout/Layout'
import MediaCarousel from '../../components/MediaCarousel/MediaCarousel'
import InterfaceContext from '../../context/interface'

const ExploreAudio = () => {
	const { state } = useContext(InterfaceContext)
	const { threadData } = state
	return (
		<>
			<Head>
				<title>Messenger Wrapped</title>
				<meta name='description' content='Messenger Wrapped' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Layout>
				<div className='w-full text-center flex flex-col items-center'>
					<ExploreCheck />
					{threadData && (
						<div className='w-full flex flex-col items-center'>
							<Label className='mb-2'>Explore audio</Label>
							<MediaCarousel
								type='audio'
								media={threadData.messages.filter(
									(message) =>
										message.audio.length > 0 &&
										message.audio[0]
								)}
							/>
						</div>
					)}
				</div>
			</Layout>
		</>
	)
}

export default ExploreAudio
