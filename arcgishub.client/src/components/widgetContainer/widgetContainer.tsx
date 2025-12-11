import './widgetContainer.css'
import React from 'react'

interface Props {
    children: React.ReactNode
}

export default function widgetContainer({ children }: Props) {
    return (
        <>
            <div className="fixed top-8">
                <div className="flex absolute items-center border-2 border-gray-200 shadow-sm rounded-xl m-5 w-100 h-23 bg-white">{children}</div>
            </div>
        </>

    )
}