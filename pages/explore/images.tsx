import Head from 'next/head'
import React, { useContext } from 'react'
import ExploreCheck from '../../components/ExploreCheck'
import Label from '../../components/Label'
import Layout from '../../components/Layout/Layout'
import InterfaceContext from '../../context/interface'

const ExploreImages = () => {
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
							<h1 className='big-title'>Images</h1>
						</div>
					)}
				</div>
			</Layout>
		</>
	)
}

export default ExploreImages
