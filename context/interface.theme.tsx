import React from 'react'

export type Theme = {
	bg: string
	bgSecondary: string
	text: string
	textPrimary: string
	fill: string
	borderSecondary: string
}

export const themes: { [index: string]: Theme } = {
	dark: {
		bg: 'bg-theme-almost-black',
		bgSecondary: 'bg-theme-light-pink',
		text: 'text-theme-light-pink',
		textPrimary: 'text-theme-almost-black',
		fill: 'fill-theme-almost-black',
		borderSecondary: 'border-theme-light-pink',
	},
	purple: {
		bg: 'bg-theme-purple',
		bgSecondary: 'bg-theme-light-orange',
		text: 'text-theme-light-orange',
		textPrimary: 'text-theme-purple',
		fill: 'fill-theme-purple',
		borderSecondary: 'border-theme-light-orange',
	},
	light: {
		bgSecondary: 'bg-theme-almost-black',
		bg: 'bg-theme-light-pink',
		text: 'text-theme-almost-black',
		textPrimary: 'text-theme-light-pink',
		fill: 'fill-theme-light-pink',
		borderSecondary: 'border-theme-almost-black',
	},
	blue: {
		bg: 'bg-theme-dark-blue',
		bgSecondary: 'bg-theme-thistle',
		text: 'text-theme-thistle',
		textPrimary: 'text-theme-dark-blue',
		fill: 'fill-theme-dark-blue',
		borderSecondary: 'border-theme-thistle',
	},
	lime: {
		bg: 'bg-theme-lime',
		bgSecondary: 'bg-theme-purple',
		text: 'text-theme-purple',
		textPrimary: 'text-theme-lime',
		fill: 'fill-theme-lime',
		borderSecondary: 'border-theme-purple',
	},
	pink: {
		bg: 'bg-theme-hotpink',
		bgSecondary: 'bg-theme-midnight-blue',
		text: 'text-theme-midnight-blue',
		textPrimary: 'text-theme-hotpink',
		fill: 'fill-theme-hotpink',
		borderSecondary: 'border-theme-midnight-blue',
	},
}
