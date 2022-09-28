import { Action } from '../context/interface.types'
import Label from './Label'

const ThreadGrid = (props: any) => {
	const { data, dispatch } = props

    // TODO: See if we can use participants photos for group photo

	return (
		<div className='w-full grid grid-cols-2 gap-4 content-center'>
			{data?.map((thread: any, idx: number) => {
				return (
					<div key={thread.title + idx} tabIndex={0} className="cursor-pointer focus:animate-bounceIn">
						<div
							onClick={() => {
								dispatch({type: Action.setThreadExcerpt, payload: thread})
							}}
							style={{ animationDelay: `${100 * idx}ms` }}
							className='animate-scaleUp opacity-0 scale-50 w-full flex flex-col justify-center items-center relative'>
							<div className='w-28 mb-2 border border-theme-1-secondary aspect-square rounded-full flex flex-col text-center justify-center items-center'>
								{thread.image ? (
									<img
										loading='lazy'
										className='aspect-square rounded-full w-full'
										src={URL.createObjectURL(thread.image)}
										alt={thread.title}
									/>
								) : (
									<p className='text-theme-1-secondary pointer-events-none'>?</p>
								)}
							</div>
							<Label className='absolute bottom-0 mb-4 min-w-[7rem] max-w-[9rem] text-ellipsis'>
								{thread.title}
							</Label>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default ThreadGrid
