import React, { useEffect, useRef } from 'react'

const StageProgress = (props: any) => {
	const { className, stages, stage, setStage, offset } = props

	const renderStages = offset ? stages.slice(offset, stages.length) : stages
	return (
		<div className={`flex w-full z-50 ${className}`}>
			{renderStages.map((s: any, idx: number) => {
				return (
					<div
						onClick={() => {
							setStage(idx + offset)
						}}
						key={idx + offset}
						className='p-1 grow'>
						<div className='bg-black opacity-25 h-1 w-full'>
							<div
								style={{
									animationDuration: `${stages[stage].time}ms`,
								}}
								className={`${
									idx + offset == stage ? 'animate-width' : ''
								} ease-linear h-full bg-white ${
									idx + offset < stage ? 'w-full' : 'w-0'
								}`}></div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default StageProgress
