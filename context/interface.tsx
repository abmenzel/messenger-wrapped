import React, { createContext, useReducer } from 'react'
import reducer from './interface.reducer'
import { Dispatch, InterfaceState } from './interface.types'

export const initialState: InterfaceState = {
	threadExcerpt: null,
	threads: [],
	threadData: null,
}

const InterfaceContext = createContext<
	| { state: InterfaceState; dispatch: Dispatch }
>({ state: initialState, dispatch: (_) => {} })

export const InterfaceProvider = ({ children }: { children: any }) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	const value = { state, dispatch }
	return (
		<>
			<InterfaceContext.Provider value={value}>
				{children}
			</InterfaceContext.Provider>
		</>
	)
}

export default InterfaceContext
