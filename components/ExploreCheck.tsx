import Link from 'next/link'
import React, { useContext } from 'react'
import InterfaceContext from '../context/interface'

const ExploreCheck = () => {
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
		<div>
			{threads.length == 0 && (
				<div className='text-center w-full'>
					<p>To explore your data you must first upload it.</p>
					<Link href={'/wrap'}>
						<a
							className={`${theme.bgSecondary} ${theme.textPrimary} btn-primary my-6`}>
							Upload data
						</a>
					</Link>{' '}
				</div>
			)}
			{threads.length > 0 && !threadData && (
				<div>
					<p>You must first pick a group</p>
					<Link href={'/wrap'}>
						<a>Pick group</a>
					</Link>
				</div>
			)}
		</div>
	)
}

export default ExploreCheck
