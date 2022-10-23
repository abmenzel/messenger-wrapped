import React, { ReactNode, useContext } from 'react'
import InterfaceContext from '../../context/interface'
import Menu from '../Menu/Menu'
import Grain from '../../assets/images/grain.jpg'

const Background = (props: any) => {
	const { theme } = props
	return (
		<div className='absolute inset-0 flex justify-center items-center w-full h-full z-[1]'>
			<div
				style={{
					backgroundImage: `url(${Grain.src})`,
				}}
				className={`absolute transition-colors h-2xfull w-2xfull z-10 -left-1/2 -top-1/2 opacity-0 mix-blend-soft-light animate-grain`}
			/>
			<div
				className={`${theme.bg} absolute transition-colors h-full w-full `}
			/>
		</div>
	)
}

const Layout = ({ children }: { children: ReactNode }) => {
	const { state } = useContext(InterfaceContext)
	const { theme } = state
	return (
		<div
			className={`min-h-screen flex justify-center relative overflow-hidden ${theme.text}`}>
			<div className='pointer-events-none grow bg-gradient-to-r from-black opacity-30 relative z-[5]' />
			<div className='w-full max-w-sm flex items-center z-[5]'>
				<div className='px-4 grow'>{children}</div>
				<div
					className={`fixed z-10 ${theme.gradientFrom} transition-colors bg-gradient-to-t bottom-0 max-w-sm w-full flex justify-center py-4 pt-16`}>
					<Menu />
				</div>
			</div>
			<div className='pointer-events-none grow bg-gradient-to-l from-black opacity-30 relative z-[5]' />
			<Background theme={theme} />
		</div>
	)
}

export default Layout
