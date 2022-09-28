import { Action } from './interface.types'

const reducer = (state: any, action: { type: Action; payload: any }) => {
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
	}
}

export const createAction = (action: Action, payload: any) => {
	return { type: action, payload: payload }
}

export default reducer
