import type MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import React, { createContext, useContext, useRef, useState, useMemo } from "react";

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
    globalLayer: React.RefObject<GraphicsLayer | null>
}

const ViewContext = createContext<MapContextValue | undefined>(undefined);

export function useMap() {
    const context = useContext(ViewContext);
    if (context === undefined) {
        throw new Error('useMap must be used within a MapContext provider');
    }
    return context;
}

export function MapContext({ children }: Props) {
    const viewRefs = useRef<HTMLDivElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(true);
    const clickRef = useRef<MapView | null>(null);

    const layer = useMemo(() => new GraphicsLayer({
        id: 'bufferLayerId',
        title: 'bufferLayers Draws',
        listMode: 'show',
        visible: true
    }),[]);
    const global = useMemo(() => new GraphicsLayer({
        id: 'globalLayerid',
        title: 'globalLayers',
        listMode: 'show',
        visible: true
    }),[])

    const bufferLayer = useRef<GraphicsLayer>(layer);
    const globalLayer = useRef<GraphicsLayer>(global)

    const value = {
        viewRefs,
        isDrawing,
        setIsDrawing,
        //divElement,
        clickRef,
        bufferLayer,
        globalLayer,
    }

    return (
        <ViewContext.Provider value={value}>
            {children}
        </ViewContext.Provider>
    );
}

