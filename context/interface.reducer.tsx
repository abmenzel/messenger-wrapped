import { stages } from '../config/stages'
import { Action, InterfaceState } from './interface.types'

const reducer = (
	state: InterfaceState,
	action: { type: Action; payload: any }
): InterfaceState => {
	switch (action.type) {
		case Action.setThreadExcerpt:
			return {
				...state,
				threadExcerpt: action.payload,
			}
		case Action.setThreads:
			return {
				...state,
				threads: action.payload,
			}
		case Action.setThreadData:
			return {
				...state,
				threadData: action.payload,
			}
		case Action.setUploadStatus:
			return {
				...state,
				uploadStatus: action.payload,
			}
		case Action.setAbortedUpload:
			return {
				...state,
				abortedUpload: action.payload,
			}
		case Action.setAudioMap:
			return {
				...state,
				audioMap: action.payload,
			}
		case Action.setVideoMap:
			return {
				...state,
				videoMap: action.payload,
			}
		case Action.setImageMap:
			return {
				...state,
				imageMap: action.payload,
			}
		case Action.setStageIndex:
			return {
				...state,
				stageIndex: action.payload,
				stage: stages[action.payload],
			}
		case Action.setStageByName:
			const stageIdx = stages.findIndex(
				(elm) => elm.name == action.payload
			)
			if (stageIdx == -1) {
				throw new Error('Stage does not exist')
			}
			return reducer(state, createAction(Action.setStageIndex, stageIdx))
		case Action.setAnimateStageIndex:
			return {
				...state,
				animateStageIndex: action.payload,
				animateStage: stages[action.payload],
			}
		case Action.setAnimateStageByName:
			const animateStageIdx = stages.findIndex(
				(elm) => elm.name == action.payload
			)
			if (animateStageIdx == -1) {
				throw new Error('Stage does not exist')
			}
			return reducer(
				state,
				createAction(Action.setStageIndex, animateStageIdx)
			)
		case Action.setTimer:
			return {
				...state,
				timer: action.payload,
			}
		case Action.setTheme:
			return {
				...state,
				theme: action.payload,
			}
	}
}

export const createAction = (action: Action, payload: any) => {
	return { type: action, payload: payload }
}

export default reducer
