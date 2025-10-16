import Polygon from "@arcgis/core/geometry/Polygon.js";
import Graphic from "@arcgis/core/Graphic.js"

function DrawPolygon(view: RefObject<__esri.MapView | null>, event: __esri.ViewClickEvent, bufferLayer: React.RefObject<GraphicsLayer | null>) {
    const graphics = bufferLayer.current?.graphics
    const longitud = event.mapPoint.longitude
    const latitud = event.mapPoint.latitude
    const countPoints = graphics.toArray();
    const rings: [number, number][] = []
    if (!graphics) return

    if (countPoints.length == 0) {
        const polygon = {
            type: "polygon",
            rings: [[longitud, latitud]]
        }

        const simpleFillSymbol = {
            type: "simple-fill",
            color: [227, 139, 79, 0.8],
            outline: { color: [255, 255, 255], width: 1 },
        }
        const polygonAtt = {
            name: "user",
            owner: "user",
            m2: "x",
            type: "PolygonBuffer"
        }

        const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: simpleFillSymbol,
            attributes: polygonAtt
        });

        graphics?.add(polygonGraphic);
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
        type: "pointSupportPolygon"
    };

    const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: pointAtt
    });

    graphics?.add(pointGraphic);

    const polygoneObject = graphics?.find((layer) => {
        return layer.geometry?.type == "polygon"
    })

    const RingsActualizado = [...polygoneObject.geometry.rings[0], [longitud, latitud]]

    polygoneObject.geometry = new Polygon({ rings: [RingsActualizado] })
    
    

}

export default DrawPolygon;