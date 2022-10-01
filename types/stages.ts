import { Theme } from '../context/interface.theme'

export enum StageName {
	Upload = 'upload',
	Friends = 'lots-of-friends',
	Pick = 'pick',
	Collect = 'collect',
	Intro = 'intro',
	Counts = 'messageCount',
	Timeline = 'timeline',
	TopContributors = 'topContributors',
	LongestMessages = 'longestMessages',
	LixLevel = 'lixLevel',
	Images = 'imageMemories',
	Videos = 'videoMemories',
}

export type Stage = {
	name: StageName
	time: number
	theme: Theme
}
