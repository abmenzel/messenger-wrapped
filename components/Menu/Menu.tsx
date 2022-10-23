import {
	LayoutGrid,
	Menu as BurgerMenu,
	Play,
	Search,
	Upload,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import InterfaceContext from '../../context/interface'
import { createAction } from '../../context/interface.reducer'
import { Theme } from '../../context/interface.theme'
import { Action } from '../../context/interface.types'
import { menuItem } from '../../types/menu'
import { StageName } from '../../types/stages'
import MenuIcon from './MenuIcon'

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
			className={`mb-4 ${
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
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const { state, dispatch } = useContext(InterfaceContext)
	const { theme, timer } = state

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
			trigger: () => {
				router.push('/wrap')
				setStageByName(StageName.Intro)
			},
		},
		{
			type: 'function',
			label: 'Pick group',
			visible: () => state.threads?.length > 0,
			trigger: () => {
				router.push('/wrap')
				if (timer) clearTimeout(timer)
				setStageByName(StageName.Pick)
			},
		},
		{
			type: 'function',
			label: 'Explore',
			trigger: () => {
				router.push('/explore')
				if (timer) clearTimeout(timer)
				setStageByName(StageName.Pick)
			},
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
				<ul className='flex items-center gap-x-4'>
					<li>
						<MenuIcon
							callback={() => {
								router.push('/wrap')
								if (timer) clearTimeout(timer)
								setStageByName(StageName.Upload)
							}}
							label={'Upload'}
							icon={<Upload size={20} />}
						/>
					</li>
					<li
						className={`${
							state.threads.length == 0 &&
							'pointer-events-none opacity-50'
						}`}>
						<MenuIcon
							callback={() => {
								router.push('/wrap')
								if (timer) clearTimeout(timer)
								setStageByName(StageName.Pick)
							}}
							label={'Pick'}
							icon={<LayoutGrid size={20} />}
						/>
					</li>
					<li
						className={`${
							!state.threadData &&
							'pointer-events-none opacity-50'
						}`}>
						<MenuIcon
							callback={() => {
								router.push('/wrap')
								if (timer) clearTimeout(timer)
								setStageByName(StageName.Intro)
							}}
							label={'Wrap'}
							icon={<Play size={20} />}
						/>
					</li>
					<li
						className={`${
							!state.threadData &&
							'pointer-events-none opacity-50'
						}`}>
						<MenuIcon
							callback={() => {
								router.push('/explore')
								if (timer) clearTimeout(timer)
								setStageByName(StageName.Pick)
							}}
							label={'Explore'}
							icon={<Search size={20} />}
						/>
					</li>
					<li>
						<MenuIcon
							callback={() => setOpen(!open)}
							label={'Menu'}
							icon={<BurgerMenu size={24} />}
						/>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default Menu
