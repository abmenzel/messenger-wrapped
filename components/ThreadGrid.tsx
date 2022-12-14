import Image from 'next/image'
import { useContext } from 'react'
import InterfaceContext from '../context/interface'
import { Action } from '../context/interface.types'
import { thread, threadExcerpt } from '../types/fb'
import Label from './Label'

const ThreadGrid = ({ threads }: { threads: threadExcerpt[] }) => {
	const { state, dispatch } = useContext(InterfaceContext)
	const { theme } = state

	// TODO: See if we can use participants photos for group photo

	return (
		<div className='w-full'>
			<p className='text-xs text-center mb-8'>
				Pick from{' '}
				<span className='font-bold'>
					{threads.length.toLocaleString()}
				</span>{' '}
				groups, with a total of{' '}
				<span className='font-bold'>
					{threads
						.reduce((acc, thread) => acc + thread.messageCount, 0)
						.toLocaleString()}
				</span>{' '}
				messages.
			</p>
			<div className='w-full grid grid-cols-2 gap-6 content-center'>
				{threads?.map((thread: any, idx: number) => {
					return (
						<div
							key={thread.title + idx}
							tabIndex={0}
							className='cursor-pointer focus:animate-bounceIn'>
							<div
								onClick={() => {
									dispatch({
										type: Action.setThreadExcerpt,
										payload: thread,
									})
								}}
								style={{ animationDelay: `${100 * idx}ms` }}
								className='animate-scaleUp opacity-0 scale-50 w-full flex flex-col justify-center items-center relative'>
								<div
									className={`w-28 p-1 border ${theme.borderSecondary} aspect-square rounded-full flex flex-col text-center justify-center items-center`}>
									{thread.image ? (
										<Image
											width={200}
											height={200}
											loading='lazy'
											className='aspect-square rounded-full w-full'
											src={URL.createObjectURL(
												thread.image
											)}
											alt={thread.title}
										/>
									) : (
										<p
											className={`${theme.text} pointer-events-none`}>
											?
										</p>
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
		</div>
	)
}

export default ThreadGrid
