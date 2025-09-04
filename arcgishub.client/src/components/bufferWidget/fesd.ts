import type Polyline from "@arcgis/core/geometry/Polyline";
import type Graphic from "@arcgis/core/Graphic";
import { useMap } from "../../context/viewContext";
import type { RefObject } from "react"
import type { GeometryUnion } from "@arcgis/core/geometry";
import * as geodesicBufferOperator from "@arcgis/core/geometry/operators/geodesicBufferOperator.js";

//import { urlUtils } from "@arcgis/core/urlUtils";
//polyline: __esri.Collection<Graphic> | undefined): Promise<Props>
interface Props {
    id: number;
    response: string
}

export async function CreateBuffer(view: RefObject<__esri.MapView | null>,layer: React.RefObject<__esri.GraphicsLayer | null>) {

    /*const url = "http://jejgelcvggsdn6mg.maps.arcgis.com/CreateBuffers/submitJob"
    esriConfig.request.proxyUrl = "/proxy/Java/proxy.jsp";
    const graphic = layer.current?.graphics
    const geometry = graphic?.find((layer) => {
        return layer.geometry?.type == "polyline"
    })

    const data = {
        inputLayer: {
            features: [
                {
                    "geometry": {
                        "path": geometry?.geometry?.paths[0]
                    }
                }
            ]
        },


        //layer:"esto es una capa", //funciono con layer y su model sera que inputLayer no esta bien declarado en el model ? 
        distances: [4.0],
        units: "Meters",
        dissolveType: "None",
        ringType: "Disks",
        sideType: "Full",
        endType: "Flat",
        
    }

    const response = await fetch('https://localhost:7169/api/CallBufferApi/callBuffer', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }*/


    const graphic = layer.current?.graphics
    const geometry: GeometryUnion = graphic?.find((layer) => {
        return layer.geometry?.type == "polyline"
    })

    const buffer = geodesicBufferOperator.execute(geometry.geometry, 100);
    console.log(view);
    
    //usar el create buffer convencional ?
    return;
}