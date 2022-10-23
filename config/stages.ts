import { themes } from '../context/interface.theme'
import { Stage, StageName } from '../types/stages'

export const stages: Stage[] = [
	{
		name: StageName.Upload,
		time: 5000,
		theme: themes.dark,
	},
	{
		name: StageName.Friends,
		time: 3000,
		theme: themes.light,
	},
	{
		name: StageName.Pick,
		time: 5000,
		theme: themes.dark,
	},
	{
		name: StageName.Collect,
		time: 5000,
		theme: themes.dark,
	},
	{
		name: StageName.Intro,
		time: 4000,
		theme: themes.purple,
	},
	{
		name: StageName.Counts,
		time: 5000,
		theme: themes.blue,
	},
	{
		name: StageName.Timeline,
		theme: themes.blue,
		time: 7000,
	},
	{
		name: StageName.TopContributors,
		theme: themes.lime,
		time: 7000,
	},
	{
		name: StageName.LongestMessages,
		time: 7000,
		theme: themes.lime,
	},
	{
		name: StageName.LixLevel,
		time: 7000,
		theme: themes.lime,
	},
	{
		name: StageName.Images,
		time: 8000,
		theme: themes.pink,
	},
	{
		name: StageName.Videos,
		time: 25000,
		theme: themes.pink,
	},
]
