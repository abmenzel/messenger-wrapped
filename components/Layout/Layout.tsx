import React, {ReactNode} from 'react'
import Menu from '../Menu/Menu'

const Layout = ({children} : {children: ReactNode}) => {
    return (
        <div className="relative min-h-screen bg-theme-primary text-theme-secondary flex justify-center">
            <div className="pointer-events-none grow bg-gradient-to-r from-black opacity-30">

            </div>
            <div className='w-full max-w-sm flex items-center'>
                {children}
                <div className='fixed z-10 bottom-0 max-w-sm w-full flex justify-center py-4'>
                    <Menu />
                </div>
            </div>
            <div className="pointer-events-none grow bg-gradient-to-l from-black opacity-30"></div>
        </div>
    )
}

export default Layout