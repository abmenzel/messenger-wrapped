import React, {ReactNode} from 'react'
import Menu from '../Menu/Menu'

const Layout = ({children} : {children: ReactNode}) => {
    return (
        <div className="min-h-screen bg-theme-primary text-theme-secondary flex flex-col items-center justify-center">
            <div className='max-w-sm overflow-hidden h-full'>
                {children}
                <div className='fixed z-10 bottom-0 max-w-sm w-full flex justify-center py-4'>
                    <Menu />
                </div>
            </div>
        </div>
    )
}

export default Layout