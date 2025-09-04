import './widgetContainer.css'
import React from 'react'

interface Props {
    children: React.ReactNode
}

export default function widgetContainer({ children }: Props) {
    return (
        <>
            <div id='widgetContainer'>{children}</div>
        </>

    )
}