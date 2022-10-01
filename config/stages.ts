import { Stage, StageName } from '../types/stages'

export const stages: Stage[] = [
	{
		name: StageName.Upload,
		time: 5000,
	},
	{
		name: StageName.Friends,
		time: 5000,
	},
	{
		name: StageName.Pick,
		time: 5000,
	},
	{
		name: StageName.Collect,
		time: 5000,
	},
	{
		name: StageName.Intro,
		time: 4000,
	},
	{
		name: StageName.Counts,
		time: 5000,
	},
	{
		name: StageName.Timeline,
		time: 7000,
	},
	{
		name: StageName.TopContributors,
		time: 7000,
	},
	{
		name: StageName.LongestMessages,
		time: 7000,
	},
	{
		name: StageName.LixLevel,
		time: 7000,
	},
	{
		name: StageName.Images,
		time: 8000,
	},
	{
		name: StageName.Videos,
		time: 25000,
	},
]
