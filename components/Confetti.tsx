import React, { useCallback, useEffect, useRef } from 'react'
import ReactConfetti from 'react-canvas-confetti'

const Confetti = () => {
	const conf = useRef<any | null>(null)

	const getInstance = useCallback((instance: any) => {
		conf.current = instance
	}, [])

	useEffect(() => {
		if (conf.current) {
			conf.current.confetti({
				origin: { y: 1.1 },
				spread: 100,
				particleCount: 50,
				colors: ['#ffd4de', '#111'],
			})
		}
	}, [])

	return (
		<div className='absolute inset-0 z-50 min-h-screen'>
			<ReactConfetti
				ref={getInstance}
				style={{
					position: 'fixed',
					pointerEvents: 'none',
					width: '100%',
					height: '100%',
					bottom: 0,
					left: 0,
					zIndex: 50,
				}}
			/>
		</div>
	)
}

export default Confetti
