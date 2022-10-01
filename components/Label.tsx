import React, { useContext } from 'react'
import InterfaceContext from '../context/interface'

const Label = (props: any) => {
	const { className, children } = props
	const { state } = useContext(InterfaceContext)
	const { theme } = state

	return (
		<p
			className={`uppercase whitespace-nowrap overflow-hidden ${theme.textPrimary} ${theme.bgSecondary} text-[0.7rem] rounded-full py-0.5 px-2 font-bold text-center break-words ${className}`}>
			{children}
		</p>
	)
}

export default Label
