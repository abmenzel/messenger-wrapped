import React, { createContext, useEffect, useReducer } from 'react'
import { stages } from '../config/stages'
import { threadExcerpt } from '../types/fb'
import { StageName } from '../types/stages'
import { getAllFiles, nameToFile } from '../utils/files'
import { collectThread, collectThreadExcerpts } from '../utils/messages'
import reducer, { createAction } from './interface.reducer'
import { themes } from './interface.theme'
import { Action, Dispatch, InterfaceState, Status } from './interface.types'

export const initialState: InterfaceState = {
	threadExcerpt: null,
	threads: [],
	threadData: null,
	uploadStatus: {
		step: 0,
		message: Status.AddData,
	},
	abortedUpload: false,
	imageMap: null,
	audioMap: null,
	videoMap: null,
	stageIndex: -1,
	animateStageIndex: -1,
	stage: stages[0],
	animateStage: stages[0],
	timer: null,
	theme: themes.dark,
}

const InterfaceContext = createContext<{
	state: InterfaceState
	dispatch: Dispatch
	handleFileSelector: () => void
}>({ state: initialState, dispatch: (_) => {}, handleFileSelector: () => {} })

export const InterfaceProvider = ({ children }: { children: any }) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	const moveOn = [StageName.Friends]

	const setStageByName = (stageName: StageName) => {
		dispatch(createAction(Action.setStageByName, stageName))
	}

	// TODO:
	// Error handling if no jsonfiles are found
	const handleFileSelector = async () => {
		try {
			dispatch(createAction(Action.setAbortedUpload, false))
			const directory: FileSystemDirectoryHandle = await (
				window as any
			).showDirectoryPicker()
			console.log('Getting all files')
			dispatch(
				createAction(Action.setUploadStatus, {
					step: 1,
					message: Status.GettingAllFiles,
				})
			)

			const files = await getAllFiles(directory)
			//files.forEach((f) => console.log(f.type))
			const jsonFiles = files.filter((file: File) =>
				file.type.includes('json')
			)
			dispatch(
				createAction(Action.setUploadStatus, {
					step: 2,
					message: Status.GettingAllMedia,
				})
			)
			const imageFiles = files.filter((file: File) =>
				file.type.includes('image')
			)

			const videoFiles = files.filter((file: File) =>
				file.type.includes('video')
			)

			const imageMap = imageFiles.reduce(nameToFile, new Map())

			const audioMap = videoFiles.reduce(nameToFile, new Map()) // Audio files are .mp4 files

			const videoMap = videoFiles.reduce(nameToFile, new Map())

			dispatch(createAction(Action.setImageMap, imageMap))
			dispatch(createAction(Action.setAudioMap, audioMap))
			dispatch(createAction(Action.setVideoMap, videoMap))

			dispatch(
				createAction(Action.setUploadStatus, {
					step: 3,
					message: Status.CollectingChats,
				})
			)

			const threads: Map<string, threadExcerpt> =
				await collectThreadExcerpts(jsonFiles, imageMap)

			dispatch(
				createAction(Action.setUploadStatus, {
					step: 4,
					message: Status.SortingChats,
				})
			)
			const sorted = [...threads.values()].sort(
				(a: threadExcerpt, b: threadExcerpt) => {
					return b.messageCount - a.messageCount
				}
			)
			console.log(sorted)

			dispatch(createAction(Action.setThreads, sorted))
			dispatch(
				createAction(Action.setUploadStatus, {
					step: 5,
					message: Status.Ready,
				})
			)
			setStageByName(StageName.Friends)
		} catch (error: any) {
			if (error instanceof DOMException) {
				console.log(error)
				dispatch(createAction(Action.setAbortedUpload, true))
			} else {
				console.log(error)
			}
		}
	}

	/**
	 * Collect all the relevant data from a thread
	 * @param thread
	 * @returns
	 */
	const handleThreadChange = async (thread: threadExcerpt) => {
		if (!state.imageMap) {
			console.error('Image map not loaded')
			return
		}
		if (!state.audioMap) {
			console.error('Audio map not loaded')
			return
		}
		if (!state.videoMap) {
			console.error('Video map not loaded')
			return
		}

		const threadData = await collectThread(
			thread,
			state.imageMap,
			state.audioMap,
			state.videoMap,
			dispatch
		)
		console.log(threadData)
		dispatch(createAction(Action.setThreadData, threadData))
	}

	/**
	 * When the thread excerpt is picked, start collecting all the data from the thread
	 */
	useEffect(() => {
		if (state.stageIndex < 0) return
		if (state.threads.length == 0) return setStageByName(StageName.Upload)

		if (state.threadExcerpt != null) {
			handleThreadChange(state.threadExcerpt)
			setStageByName(StageName.Collect)
		} else {
			setStageByName(StageName.Pick)
		}
	}, [state.threadExcerpt])

	/**
	 * When thread data changes change the stage
	 */
	useEffect(() => {
		if (state.stageIndex < 0) return
		if (state.threads.length == 0) return setStageByName(StageName.Upload)

		if (!state.threadData) return setStageByName(StageName.Pick)

		setStageByName(StageName.Intro)
	}, [state.threadData])

	/**
	 * Whenever a stage changes, it can only be animated once the previously active stage is finished animating out.
	 */
	useEffect(() => {
		setTimeout(() => {
			dispatch(
				createAction(Action.setAnimateStageIndex, state.stageIndex)
			)
		}, 300)
		if (moveOn.includes(state.stage.name)) {
			setTimeout(() => {
				dispatch(
					createAction(Action.setStageIndex, state.stageIndex + 1)
				)
			}, 100000)
		}
	}, [state.stageIndex])

	/**
	 * Update theme depending on active stage
	 */
	useEffect(() => {
		if (state.animateStage) {
			dispatch(createAction(Action.setTheme, state.animateStage.theme))
		}
	}, [state.animateStage])

	const value = { state, dispatch, handleFileSelector }
	return (
		<InterfaceContext.Provider value={value}>
			{children}
		</InterfaceContext.Provider>
	)
}

export default InterfaceContext
