//import type Polyline from "@arcgis/core/geometry/Polyline";
import Polyline from "@arcgis/core/geometry/Polyline";
import Graphic from "@arcgis/core/Graphic";
import { useMap } from "../../context/viewContext";
import type { RefObject } from "react"
import { useEffect } from "react"
import type { GeometryUnion } from "@arcgis/core/geometry";
import * as geometryEngineAsync from "@arcgis/core/geometry/geometryEngineAsync.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";



const CreateBuffer = () => {
    //const { clickRef } = useMap()
    const { bufferLayer } = useMap()

    useEffect(() => {
        generarBufferGraphic()

    },)

    const generarBufferGraphic = async () => {
        const view = bufferLayer.current?.graphics
        const geometry: GeometryUnion = view?.find((layer) => {
            return layer.geometry?.type == "polyline"
        })
        
        try {
            const bufferGeo = await geometryEngineAsync.geodesicBuffer(geometry.geometry, 100, "meters")
            const bufferAtt = {
                Name: "user",
                owner: "user",
                space: "number",
                type: "Buffer",
            }
            const bufferSymbol = new SimpleFillSymbol({
                color: [255, 0, 0, 0.9],
                outline: {
                    color: [0, 0, 0, 0.8],
                    width:1
                }
            });

            const bufferGraphic = new Graphic({
                geometry: bufferGeo,
                symbol: bufferSymbol,
                attributes: bufferAtt
            });
            view?.add(bufferGraphic)
            console.log(view);
            return bufferGeo
        } catch (error) {
            console.error("Error al generar buffer ", error)
            return null
        }
    }
    
    
    return null
}

export default CreateBuffer; 


//import { urlUtils } from "@arcgis/core/urlUtils";
//polyline: __esri.Collection<Graphic> | undefined): Promise<Props>
/*interface Props {
    id: number;
    response: string
}*/

/*export async function createBuffer(view: RefObject<__esri.MapView | null>, layer: React.RefObject<__esri.GraphicsLayer | null>) {

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


    /*const graphic = layer.current?.graphics
    const geometry: GeometryUnion = graphic?.find((layer) => {
        return layer.geometry?.type == "polyline"
    })

    const buffer = geodesicBufferOperator.execute(geometry.geometry, 100);
    console.log(view);

    //usar el create buffer convencional ?
    return;
}*/