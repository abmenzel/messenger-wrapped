import React, { useContext } from 'react'
import InterfaceContext from '../context/interface'

const Progressbar = (props: any) => {
	const { step, max, text, className } = props
	const width = `${(step / max) * 100}%`
	const { state } = useContext(InterfaceContext)
	const { theme } = state
	return (
		<div className={`${className} flex flex-col items-center`}>
			<div
				className={`w-48 h-3 border ${theme.borderSecondary} rounded-full overflow-hidden`}>
				<div
					className={`transition-all duration-500 h-full ${theme.bgSecondary}`}
					style={{ width: width }}></div>
			</div>
			<p className={`${theme.text}  mt-2 text-xs animate-pulse`}>
				{text}
			</p>
		</div>
	)
}

export default Progressbar
