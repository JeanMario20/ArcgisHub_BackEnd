import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
//import './index.css'
import MapView from '../src/components/MapView/MapView'
import WidgetContainer from './components/widgetContainer/widgetContainer'
import BufferTemplate from './components/bufferWidget/bufferWidget'
import { MapContext } from './context/viewContext'
import JoinTeamsConfig from './components/joinTeamsConfig/JoinTeamsConfig'

export default function HubMain() {
    return (
    <>
    <StrictMode>
        <MapContext>
            <MapView>
                <WidgetContainer>
                    <BufferTemplate />
                    <JoinTeamsConfig />
                </WidgetContainer>
            </MapView>
        </MapContext>
    </StrictMode>,
    </>
    )
}
