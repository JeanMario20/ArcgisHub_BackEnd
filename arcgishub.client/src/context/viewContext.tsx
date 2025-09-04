import type MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import React, { createContext, useContext, useRef, useState } from "react";

/*interface layersValues{
    bufferLayer: React.RefObject<GraphicsLayer | null>,
    children: React.ReactNode,
}*/

interface Props {
    children: React.ReactNode;
}

interface MapContextValue {
    viewRefs: React.RefObject<HTMLInputElement | null>
    isDrawing: boolean;
    setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    //divElement: () => void;
    clickRef: React.RefObject<MapView | null>
    bufferLayer: React.RefObject<GraphicsLayer | null>,
}

const ViewContext = createContext<MapContextValue | undefined>(undefined);

export function useMap() {
    const context = useContext(ViewContext);
    if (context === undefined) {
        throw new Error('useMap must be used withing a MapCONTEXT provider');
    }
    return context;
}

export function MapContext({ children }: Props) {
    const viewRefs = useRef<HTMLInputElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(true);
    const clickRef = useRef<MapView | null>(null);
    const bufferLayer = useRef<GraphicsLayer>(new GraphicsLayer());

    const layer = new GraphicsLayer({
        id: 'bufferLayerId',  // Identificador único
        title: 'bufferLayers Draws',
        listMode: 'show',       // Aparece en la lista de capas
        visible: true           // Visibilidad inicial
    });

    bufferLayer.current = layer;

    const value = {
        viewRefs,
        isDrawing,
        setIsDrawing,
        //divElement,
        clickRef,
        bufferLayer,
    }

    return (
        <ViewContext.Provider value={value}>
            {children}
        </ViewContext.Provider>
    );
}

