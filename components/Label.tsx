import React from 'react'

const Label = (props:any) => {
    const {className, children} = props
    return (
        <p className={`uppercase whitespace-nowrap overflow-hidden text-theme-1-primary text-[0.7rem] rounded-full bg-theme-1-secondary py-0.5 px-2 font-bold text-center break-words ${className}`}>{children}</p>
    )   
}

export default Label