import React from 'react'

const Progressbar = (props: any) => {
    const {step, max, text, className} = props
    const width = `${step / max * 100}%`
    return (
        <div className={`${className} flex flex-col items-center`}>
            <div className={`w-48 h-3 border border-theme-secondary rounded-full overflow-hidden`}>
                <div className="transition-all h-full bg-theme-secondary" style={{width: width}}></div>
            </div>
            <p className="text-theme-secondary mt-2 text-xs">{text}</p>
        </div>

    )
}

export default Progressbar