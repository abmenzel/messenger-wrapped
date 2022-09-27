import Link from 'next/link'
import React, { useState } from 'react'
import MenuIcon from '../../assets/icons/menu-icon.svg'

const menuData = [
	{
		label: 'Get started',
		link: '/wrap',
	},
	{
		label: 'Playground',
		link: '/playground',
	}
]

const MenuItem = ({item}: any) => {
	return (
		<Link href={item.link}>
			<a className='font-bold text-xl whitespace-nowrap uppercase'>
				{item.label}
			</a>
		</Link>
	)
}

const MenuContent = ({ open }: { open: boolean }) => {
	return (
		<div
			className={`${
				open ? '' : 'opacity-0 pointer-events-none translate-y-2'
			} transition-all absolute bottom-12 rounded-md bg-theme-secondary text-theme-primary p-4 px-8`}>
			<ul>
				{menuData.map((item, idx) => {
					return (
						<li key={idx}>
							<MenuItem item={item} />
						</li>
					)
				})}
			</ul>
		</div>
	)
}

const Menu = () => {
	const [open, setOpen] = useState(false)
	// TODO
	// Add open/close functionality
	// Add link to pick group
	// Add link to upload data
	// Add link to share
	// Add link to playground
	// Add link to credits?

	return (
		<div className='relative flex flex-col items-center'>
			<MenuContent open={open} />
			<button
				onClick={() => setOpen(!open)}
				className='aspect-square rounded-md bg-theme-secondary w-10 fill-theme-primary flex items-center p-1'>
				<MenuIcon height='100%' width='100%' viewBox='0 0 48 48' />
			</button>
		</div>
	)
}

export default Menu
