import React from 'react'

const Label = (props:any) => {
    const {className, children} = props
    return (
        <p className={`uppercase whitespace-nowrap overflow-hidden text-theme-primary text-[0.7rem] rounded-full bg-theme-secondary py-0.5 px-2 font-bold text-center break-words ${className}`}>{children}</p>
    )   
}

export default Label