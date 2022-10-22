import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/Layout/Layout'
import InterfaceContext, { InterfaceProvider } from '../../context/interface'
import { useContext } from 'react'
import Label from '../../components/Label'
import ExploreCheck from '../../components/ExploreCheck'
import { Headphones, Image, MessageSquare, Video } from 'lucide-react'

const Explore: NextPage = () => {
	const { state } = useContext(InterfaceContext)
	const {
		theme,
		threadExcerpt,
		threads,
		threadData,
		uploadStatus,
		abortedUpload,
		stageIndex,
		animateStageIndex,
		stage,
		animateStage,
		timer,
	} = state
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
						<div className='flex flex-col items-center'>
							<Label className='mb-2'>Explore</Label>
							<h1 className='big-title mb-8'>
								{threadData.title}
							</h1>

							<ul className='flex flex-col items-center'>
								<li>
									<Link href={'/explore/messages'}>
										<a
											className={`${
												threadData.messageCount == 0 &&
												'pointer-events-none opacity-50'
											} flex items-center gap-x-2 btn-primary`}>
											<MessageSquare size={24} />
											Messages
										</a>
									</Link>
								</li>
								<li>
									<Link href={'/explore/images'}>
										<a
											className={`${
												threadData.photoCount == 0 &&
												'pointer-events-none opacity-50'
											} flex items-center gap-x-2 btn-primary`}>
											<Image size={24} />
											Images
										</a>
									</Link>
								</li>
								<li>
									<Link href={'/explore/videos'}>
										<a
											className={`${
												threadData.videoCount == 0 &&
												'pointer-events-none opacity-50'
											} flex items-center gap-x-2 btn-primary`}>
											<Video size={24} />
											Videos
										</a>
									</Link>
								</li>
								<li>
									<Link href={'/explore/audio'}>
										<a
											className={`${
												threadData.audioSeconds == 0 &&
												'pointer-events-none opacity-50'
											} flex items-center gap-x-2 btn-primary`}>
											<Headphones size={24} />
											Audio
										</a>
									</Link>
								</li>
							</ul>
						</div>
					)}
				</div>
			</Layout>
		</>
	)
}

export default Explore
