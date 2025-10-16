import { type RefObject } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic.js"

interface collection {
    view: RefObject<__esri.MapView | null>,
    event: __esri.ViewClickEvent,
    coordenadasPoints: number[][],
    bufferLayer: React.RefObject<GraphicsLayer | null>,
}
function DrawPoint({ event, coordenadasPoints, bufferLayer }: collection) {
    const graphics = bufferLayer.current?.graphics
    const longitud = event.mapPoint.longitude
    const latitud = event.mapPoint.latitude

    
    if (!graphics) return

    if (graphics?.toArray().length > 0) {
        bufferLayer.current?.graphics.removeAll();
    }

    const point = {
        type: "point", // autocasts as new Point()
        longitude: longitud,
        latitude: latitud
    };


    const markerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
            color: [255, 255, 255],
            width: 2
        },
    };

    const pointAtt = {

        Name: "user",
        owner: "user",
        space: "number",
        x: event.mapPoint.longitude?.toString(),
        y: event.mapPoint.latitude?.toString(),
        type: "pointBuffer"
    };



    const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: pointAtt
    });

    graphics?.add(pointGraphic);
}

export default DrawPoint;