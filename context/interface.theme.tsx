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
		bg: 'bg-theme-0-primary',
		bgSecondary: 'bg-theme-0-secondary',
		text: 'text-theme-0-secondary',
		textPrimary: 'text-theme-0-primary',
		fill: 'fill-theme-0-primary',
		borderSecondary: 'border-theme-0-secondary',
	},
	purple: {
		bg: 'bg-theme-1-primary',
		bgSecondary: 'bg-theme-1-secondary',
		text: 'text-theme-1-secondary',
		textPrimary: 'text-theme-1-primary',
		fill: 'fill-theme-1-primary',
		borderSecondary: 'border-theme-1-secondary',
	},
	light: {
		bg: 'bg-theme-2-primary',
		bgSecondary: 'bg-theme-2-secondary',
		text: 'text-theme-2-secondary',
		textPrimary: 'text-theme-2-primary',
		fill: 'fill-theme-2-primary',
		borderSecondary: 'border-theme-2-secondary',
	},
}
