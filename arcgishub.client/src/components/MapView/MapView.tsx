/* eslint-disable @typescript-eslint/no-unused-vars */
//import "@arcgis/map-components";
import "./mapView.css"
import Map from "@arcgis/core/Map"
import MapView from "@arcgis/core/views/MapView"
import { useContext, useEffect } from "react"
import { useMap } from "../../context/viewContext";

interface Props {
    children?: React.ReactNode;
}

function ShowMap({ children }: Props) {

    const { viewRefs, clickRef, bufferLayer } = useMap();

    useEffect(() => {
        if (!viewRefs.current || clickRef.current) return;

        const map = new Map({
            basemap: "gray-vector"
        });

        const view = new MapView({
            container: viewRefs.current,
            map: map,
            zoom: 10,
            center: [-92.93028, 17.98689],// Coordenadas de ejemplo
        });
        if (bufferLayer.current && !map.layers.includes(bufferLayer.current)) {
            map.add(bufferLayer.current);
        }
        
        clickRef.current = view;

        /*const anotherMap = document.getElementsByClassName('esri-view-user-storage');

        while (anotherMap.length > 0) {
            anotherMap[0].parentNode?.removeChild(anotherMap[0])
        }*/  
        /*return () => {
            view.destroy()
            clickRef.current = null
        };*/
    }, []);


    return (
        <div ref={viewRefs}
        id="viewDiv" style={{ width: "247vh" }}>{children}</div>
    )
}

export default function mapView({ children }: Props) {
    return (
        <>
            <ShowMap />
            {children}
        </>
    )

}