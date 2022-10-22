import Link from 'next/link'
import React, { useContext, useState } from 'react'
import MenuIcon from '../../assets/icons/menu-icon.svg'
import InterfaceContext from '../../context/interface'
import { createAction } from '../../context/interface.reducer'
import { Theme } from '../../context/interface.theme'
import { Action } from '../../context/interface.types'
import { menuItem } from '../../types/menu'
import { StageName } from '../../types/stages'

const MenuItem = ({ item, setOpen }: { item: menuItem; setOpen: Function }) => {
	const className =
		'cursor-pointer block w-full text-center font-bold text-xl whitespace-nowrap uppercase'

	if (item.type === 'link') {
		return (
			<>
				{item.visible() && (
					<Link href={item.link}>
						<a className={className}>{item.label}</a>
					</Link>
				)}
			</>
		)
	} else {
		return (
			<>
				{item.visible() && (
					<div
						onClick={() => {
							setOpen(false)
							item.trigger()
						}}
						className={className}>
						{item.label}
					</div>
				)}
			</>
		)
	}
}

const MenuContent = ({
	open,
	theme,
	menuData,
	setOpen,
}: {
	open: boolean
	theme: Theme
	menuData: menuItem[]
	setOpen: Function
}) => {
	return (
		<div
			className={`${
				open ? '' : 'opacity-0 pointer-events-none translate-y-2'
			} transition-all absolute bottom-12 rounded-md ${
				theme.bgSecondary
			} ${theme.textPrimary} p-4 px-8`}>
			<ul>
				{menuData.map((item, idx) => {
					return (
						<li key={idx}>
							<MenuItem item={item} setOpen={setOpen} />
						</li>
					)
				})}
			</ul>
		</div>
	)
}

const Menu = () => {
	const [open, setOpen] = useState(false)
	const { state, dispatch } = useContext(InterfaceContext)
	const { theme } = state

	const setStageByName = (stageName: StageName) => {
		dispatch(createAction(Action.setStageByName, stageName))
	}
	// TODO
	// Add link to upload data
	// Add link to share
	// Add link to credits?

	const menuData: menuItem[] = [
		{
			type: 'link',
			label: 'Get started',
			link: '/',
			visible: () => true,
		},
		{
			type: 'function',
			label: 'wrap',
			visible: () => true,
			trigger: () => setStageByName(StageName.Upload),
		},
		{
			type: 'function',
			label: 'Pick group',
			visible: () => state.threads?.length > 0,
			trigger: () => setStageByName(StageName.Pick),
		},
		{
			type: 'link',
			label: 'Explore',
			link: '/explore',
			visible: () => state.threadData != null,
		},
	]

	return (
		<div className='relative flex flex-col items-center'>
			<MenuContent
				theme={theme}
				open={open}
				menuData={menuData}
				setOpen={setOpen}
			/>
			<nav>
				<ul className='flex items-center gap-x-2'>
					<li>
						<button
							onClick={() => setOpen(!open)}
							className={`transition-colors aspect-square rounded-md w-10 ${theme.bgSecondary} ${theme.fill} flex items-center p-1`}>
							<MenuIcon
								height='100%'
								width='100%'
								viewBox='0 0 48 48'
							/>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Menu
