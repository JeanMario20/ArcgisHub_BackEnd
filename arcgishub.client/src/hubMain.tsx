import { StrictMode, useState } from 'react'
//import { createRoot } from 'react-dom/client'
//import './index.css'
import MapView from '../src/components/MapView/MapView'
import WidgetContainer from './components/widgetContainer/widgetContainer'
import BufferTemplate from './components/bufferWidget/bufferWidget'
import { MapContext } from './context/viewContext'
import JoinTeamsConfig from './components/joinTeamsConfig/JoinTeamsConfig'

export default function HubMain() {
    const [containerVisibleWidget, setContainerVisibleWidget] = useState<string>("") //o usar un context en vez de pasar por props a los hijos???
    return (
    <>
    <StrictMode>
        <MapContext>
            <MapView>
                <WidgetContainer>
                            <BufferTemplate
                                containerVisibleWidget={containerVisibleWidget}
                                setContainerVisibleWidget={setContainerVisibleWidget}/>
                            <JoinTeamsConfig containerVisibleWidget={containerVisibleWidget} setContainerVisibleWidget={setContainerVisibleWidget}/>
                </WidgetContainer>
            </MapView>
        </MapContext>
    </StrictMode>,
    </>
    )
}
