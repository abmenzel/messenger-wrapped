import React from 'react'

const Progressbar = (props: any) => {
    const {step, max, text, className} = props
    const width = `${step / max * 100}%`
    return (
        <div className={`${className} flex flex-col items-center`}>
            <div className={`w-48 h-3 border border-theme-1-secondary rounded-full overflow-hidden`}>
                <div className="transition-all duration-500 h-full bg-theme-1-secondary" style={{width: width}}></div>
            </div>
            <p className="text-theme-1-secondary mt-2 text-xs animate-pulse">{text}</p>
        </div>
    )
}

export default Progressbar