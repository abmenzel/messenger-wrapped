import React, { useEffect, useRef } from 'react'

const StageProgress = (props: any) => {
    const {className, stages, stage, setStage} = props

    return (
        <div className={`flex w-full ${className}`}>
            {stages.map((s: any, idx: number) => {
                return (
                    <div onClick={() => {setStage(idx)}} key={idx} className="p-1 grow">
                        <div className="bg-black opacity-25 h-1 w-full">
                            <div className={`${idx == stage ? 'animate-width' : ''} ease-linear h-full bg-white ${idx < stage ? 'w-full' : 'w-0'}`}></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default StageProgress