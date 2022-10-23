import React, { useContext } from 'react'
import InterfaceContext from '../../context/interface'

const MenuIcon = ({
	icon,
	label,
	callback,
}: {
	icon: any
	label: string
	callback: Function
}) => {
	const { state, dispatch } = useContext(InterfaceContext)
	const { theme } = state
	return (
		<button
			onClick={() => callback()}
			className={`transition-colors aspect-square rounded-md w-10 ${theme.text} flex flex-col justify-center items-center p-1`}>
			<div className='w-10 aspect-square flex items-center justify-center'>
				{icon}
			</div>
			<span className='uppercase text-[0.5rem] tracking-wide'>
				{label}
			</span>
		</button>
	)
}

export default MenuIcon
