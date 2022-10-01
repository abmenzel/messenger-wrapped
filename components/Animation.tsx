import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

const Fade = (props: any) => {
	const { children, showIf, exitCallback } = props
	const nodeRef = useRef(null)
	return (
		<CSSTransition
			in={showIf}
			unmountOnExit={true}
			onExited={() => {
                exitCallback && exitCallback()
			}}
			timeout={300}
			classNames={{
				enter: 'opacity-0',
				enterActive: 'opacity-1',
				enterDone: 'opacity-1',
				exit: 'opacity-0',
				exitDone: 'opacity-0',
			}}
			className='w-full opacity-0 transition-all duration-300'
			nodeRef={nodeRef}>
			<div ref={nodeRef}>{children}</div>
		</CSSTransition>
	)
}

const FadeScale = (props: any) => {
	const { children, showIf, exitCallback } = props
	const nodeRef = useRef(null)
	return (
		<CSSTransition
			in={showIf}
			unmountOnExit={true}
			onExited={() => {
                exitCallback && exitCallback()
			}}
			timeout={300}
			classNames={{
				enter: 'opacity-0 scale-110',
				enterActive: 'opacity-1 scale-110',
				enterDone: 'opacity-1 scale-100',
				exit: 'opacity-0 scale-90',
				exitDone: 'opacity-0 scale-90',
			}}
			className='w-full opacity-0 scale-110 transition-all duration-300'
			nodeRef={nodeRef}>
			<div ref={nodeRef}>{children}</div>
		</CSSTransition>
	)
}

export { Fade, FadeScale }
