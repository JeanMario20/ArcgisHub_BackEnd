import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import MapView from '../src/components/MapView/MapView'
import WidgetContainer from './components/widgetContainer/widgetContainer'
import BufferTemplate from './components/bufferWidget/bufferWidget'
import { MapContext } from './context/viewContext'
import Login from './components/LoginUsers/LoginUser'
import Register from './components/RegisterUser/RegistroUser'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BienvenidaUsuario from './components/BienvenidaUsuario/BienvenidaUsuario'
import HubMain from './hubMain'
import IsAuthenticate from './components/isAuth/isAuthenticate'

//import isAuthenticated from './isAuth'

//import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
            <Routes>
                <Route path="" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Bienvenido" element={<BienvenidaUsuario />} />
                <Route path="/Entrandohub" element={
                    <IsAuthenticate>
                        <HubMain />
                    </IsAuthenticate>}
                />
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
