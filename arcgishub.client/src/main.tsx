import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MapView from '../src/components/MapView/MapView'
import WidgetContainer from './components/widgetContainer/widgetContainer'
import BufferTemplate from './components/bufferWidget/bufferWidget'
import { MapContext } from './context/viewContext'

//import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapContext> 
        <MapView>    
            <WidgetContainer>
                <BufferTemplate/>
            </WidgetContainer>
        </MapView>
    </MapContext>
  </StrictMode>,
)
