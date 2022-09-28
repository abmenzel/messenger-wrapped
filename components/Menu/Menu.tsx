import Link from 'next/link'
import React, { useState } from 'react'
import MenuIcon from '../../assets/icons/menu-icon.svg'
import { menuItem } from '../../types/menu'
import { Stage } from '../../types/stages'

const menuData: menuItem[] = [
	{
		type: 'link',
		label: 'Get started',
		link: '/',
		visible: () => true,
	},
	{
		type: 'function',
		label: 'Pick group',
		visible: () => true,
		stage: Stage.Pick
	},
	{
		type: 'link',
		label: 'Playground',
		link: '/playground',
		visible: () => true,
	},
]

const MenuItem = ({ item, setActiveStage }: { item: menuItem, setActiveStage: (stage: Stage) => void }) => {
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
					<div onClick={() => setActiveStage(item.stage)} className={className}>
						{item.label}
					</div>
				)}
			</>
		)
	}
}

const MenuContent = ({ open, setActiveStage }: { open: boolean, setActiveStage: (stage: Stage) => void }) => {
	return (
		<div
			className={`${
				open ? '' : 'opacity-0 pointer-events-none translate-y-2'
			} transition-all absolute bottom-12 rounded-md bg-theme-secondary text-theme-primary p-4 px-8`}>
			<ul>
				{menuData.map((item, idx) => {
					return (
						<li key={idx}>
							<MenuItem setActiveStage={setActiveStage} item={item} />
						</li>
					)
				})}
			</ul>
		</div>
	)
}

const Menu = ({setActiveStage} : {setActiveStage: (stage: Stage) => void}) => {
	const [open, setOpen] = useState(false)
	// TODO
	// Add link to pick group
	// Add link to upload data
	// Add link to share
	// Add link to playground
	// Add link to credits?

	return (
		<div className='relative flex flex-col items-center'>
			<MenuContent setActiveStage={setActiveStage} open={open} />
			<button
				onClick={() => setOpen(!open)}
				className='aspect-square rounded-md bg-theme-secondary w-10 fill-theme-primary flex items-center p-1'>
				<MenuIcon height='100%' width='100%' viewBox='0 0 48 48' />
			</button>
		</div>
	)
}

export default Menu
