import React from 'react'
import { CSSTransition } from 'react-transition-group'

const Fade = (props: any) => {
	const { children, showIf, pageTransition, setTransitioning } = props
	return (
		<CSSTransition
			in={showIf}
			unmountOnExit={true}
			onEnter={() => {
				if (!pageTransition) return
				setTransitioning(true)
			}}
			onExit={() => {
				if (!pageTransition) return
				setTransitioning(true)
			}}
			onEntered={() => {
				if (!pageTransition) return
				setTransitioning(false)
			}}
			onExited={() => {
				if (!pageTransition) return
				setTransitioning(false)
			}}
			timeout={500}
			classNames={{
				enter: 'opacity-0',
				enterActive: 'opacity-1',
				enterDone: 'opacity-1',
				exit: 'opacity-0',
				exitDone: 'opacity-0',
			}}
			className='opacity-0 transition-all duration-500'>
			<div>{children}</div>
		</CSSTransition>
	)
}

const FadeScale = (props: any) => {
	const { children, showIf, exitCallback } = props
	return (
		<CSSTransition
			in={showIf}
			unmountOnExit={true}
			onExited={() => {
                exitCallback && exitCallback()
			}}
			timeout={500}
			classNames={{
				enter: 'opacity-0 scale-110',
				enterActive: 'opacity-1 scale-110',
				enterDone: 'opacity-1 scale-100',
				exit: 'opacity-0 scale-90',
				exitDone: 'opacity-0 scale-90',
			}}
			className='w-full opacity-0 scale-110 transition-all duration-500'>
			<div>{children}</div>
		</CSSTransition>
	)
}

const Scale = (props: any) => {
	const { children, showIf, pageTransition, setTransitioning } = props
	return (
		<CSSTransition
			in={showIf}
			unmountOnExit={true}
			onEnter={() => {
				if (!pageTransition) return
				setTransitioning(true)
			}}
			onExit={() => {
				if (!pageTransition) return
				setTransitioning(true)
			}}
			onEntered={() => {
				if (!pageTransition) return
				setTransitioning(false)
			}}
			onExited={() => {
				if (!pageTransition) return
				setTransitioning(false)
			}}
			timeout={500}
			classNames={{
				enter: 'scale-110',
				enterActive: 'scale-110',
				enterDone: 'scale-100',
				exit: 'scale-95',
				exitDone: 'scale-95',
			}}
			className='scale-100 transition-all duration-500'>
			<div>{children}</div>
		</CSSTransition>
	)
}

export { Fade, Scale, FadeScale }
