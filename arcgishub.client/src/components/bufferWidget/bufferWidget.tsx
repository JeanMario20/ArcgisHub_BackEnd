import './bufferWidget.css';
import { type ReactNode, type MouseEvent, useEffect, useRef, type RefObject, useState } from "react";
import { useMap } from '../../context/viewContext';
import Graphic from "@arcgis/core/Graphic.js"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Polyline from "@arcgis/core/geometry/Polyline";
import  CreateBuffer from './CreateBuffer';


interface Props {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    isDrawPolyline: boolean;
    setIsDrawPolyline: React.Dispatch<React.SetStateAction<boolean>>,
    coordenadas: number[],
}

function Button({ onClick, children }: Props) {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    )
}





function Div({ children }: Props) {
    return (
        <div id='bufferContainerInfo'>{children}</div>
    )
}


function BufferWidget() {
    const [containerVisible, setContainerVisible] = useState(false);
    const [isDrawPolyline, setIsDrawPolyline] = useState<boolean>(false);
    const [actualizar, setActualizar] = useState(0);
    let { clickRef } = useMap();
    const isDrawPolylineRef = useRef(isDrawPolyline);
    const { bufferLayer } = useMap()
    //const view = clickRef;
    const coordenadasPoints: number[][] = [];
    const coordenadasPolyline: number[] = []
    const trazoCounter = { trazo: 0 };
    const [activateBuffer, setActivateBuffer] = useState(false);

    useEffect(() => {
        isDrawPolylineRef.current = isDrawPolyline;
        if (isDrawPolylineRef.current) {
            const handlerClick = clickRef.current?.on("click", (event) => {
                DibujarPolyline(clickRef, event, coordenadasPoints, trazoCounter, bufferLayer); //estoy guardando el dibujo en bufferLayer ???? 
                coordenadasPolyline.push([event.mapPoint.longitude, event.mapPoint.latitude]);
                setActualizar(prev => prev + 1)
                //sustituye todos los view por clickRef por que no estas modificando el original si no las copias.

            })
            const handlerDoubleClick = clickRef.current?.on("double-click", (event) => {
                setIsDrawPolyline(prev => !prev);

            })

            return () => {
                handlerClick?.remove();
                handlerDoubleClick?.remove();
            };
        } else {
            return;
        }

    }, [isDrawPolyline, clickRef, coordenadasPoints, trazoCounter, bufferLayer, coordenadasPolyline])

    function ButtonAnalisis({ param, children }) {
        return (
            <button onClick={() => EjecutarAnalisis()}>
                {children}
            </button>
        )
    }
    function EjecutarAnalisis() {
        setActivateBuffer(true)
    }

    

    function borrarPolyline() {
        bufferLayer.current?.graphics.removeAll();

    }

    function retrocederDibujo() {
        const graphics = bufferLayer.current?.graphics
        const arrayCoords: number[][] = []
        const polylineObjec = graphics?.find((layer) => {
            return layer.geometry?.type == "polyline"
        })

        if (polylineObjec)
            graphics?.remove(polylineObjec)

        if (graphics) {
            const limit = graphics.length - 1


            for (let i = 0; i < limit; i++) {
                const LayerInfo = graphics.getItemAt(i)?.attributes;
                if (LayerInfo) {
                    arrayCoords.push([Number(LayerInfo.x), Number(LayerInfo.y)])
                }
            }
        }

        graphics?.pop()

        const polyline = {
            type: "polyline",
            paths: [
                arrayCoords
            ]
        };


        const lineSymbol = {
            type: "simple-line",
            color: [226, 119, 40],
            width: 4
        };

        const lineAtt = {
            Name: "temp",
            owner: "temp",
            length: "temp",
            type: "polyline",
        };

        const polylineGraphics = new Graphic({
            geometry: polyline,
            Symbol: lineSymbol,
            attributes: lineAtt,
        });

        graphics?.add(polylineGraphics);


    }

    return (
        <>
            <Button onClick={() => setContainerVisible(!containerVisible)}>Buffer</Button>
            {containerVisible ?
                <>
                    <Div>
                        <div id="buttonContainer">
                            <Button onClick={() => setIsDrawPolyline(prev => !prev)}>Polyline</Button>
                            <Button onClick={borrarPolyline}>Borrar todo</Button>
                            <Button onClick={retrocederDibujo}>Retroceder</Button>
                        </div>
                        <div id="bufferOptionsForm">
                            <label id="bufferOptionsLabels" htmlFor="someText1">ejemplo</label>
                            <input id="bufferOptionsInput" type="text" name="nameText1" placeholder="escribe algo" />

                            <label id="bufferOptionsLabels" htmlFor="someText2">ejemplo</label>
                            <input id="bufferOptionsInput" type="text" name="nameText2" placeholder="escribe algo" />

                            <label id="bufferOptionsLabels" htmlFor="someText2">ejemplo</label>
                            <input id="bufferOptionsInput" type="text" name="nameText3" placeholder="escribe algo" />

                            <ButtonAnalisis param={bufferLayer}>Ejecutar Analisis</ButtonAnalisis>
                            {activateBuffer && <CreateBuffer />}

                        </div>
                    </Div>
                </>
                :
                <div></div>}
        </>
    )
}

export default function BufferTemplate() {
    return (
        <BufferWidget />
    )
}

function DibujarPolyline(view: RefObject<__esri.MapView | null>, event: __esri.ViewClickEvent, coordenadas: number[][], ref: { trazo: number }, bufferLayer: React.RefObject<GraphicsLayer | null>) {

    const graphics = bufferLayer.current?.graphics
    const polylineObject = graphics?.find((layer) => {
        return layer.geometry?.type == "polyline"
    })

    const point = {
        type: "point", // autocasts as new Point()
        longitude: event.mapPoint.longitude,
        latitude: event.mapPoint.latitude,
    };

    coordenadas.push([event.mapPoint.longitude, event.mapPoint.latitude]);

    const markerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
            color: [255, 255, 255],
            width: 2
        },
    };

    const pointAtt = {
        id: ref.trazo,
        Name: "user",
        owner: "user",
        space: "number",
        x: event.mapPoint.longitude?.toString(),
        y: event.mapPoint.latitude?.toString(),
        type: "point"
    };

    ref.trazo++;

    const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: pointAtt
    });

    //view.current?.graphics.add(pointGraphic); <-- dibujar en el mapa
    graphics?.add(pointGraphic);
    const countGraphics = bufferLayer.current?.graphics.length;


    if (countGraphics != undefined && countGraphics == 1 && polylineObject == undefined) {

        const polyline = new Polyline({
            type: "polyline",
            paths: [event.mapPoint.longitude, event.mapPoint.latitude]
        })


        const lineSymbol = {
            type: "simple-line",
            color: [226, 119, 40],
            width: 4
        };

        const lineAtt = {
            Name: "temp",
            owner: "temp",
            length: "temp",
            trazo: 0
        };

        const polylineGraphics = new Graphic({
            geometry: polyline,
            Symbol: lineSymbol,
            attributes: lineAtt,
        });

        graphics?.add(polylineGraphics);
    }

    if (countGraphics != undefined && countGraphics > 1 && bufferLayer.current?.graphics.items[1].geometry) {

        if (polylineObject && polylineObject.geometry instanceof Polyline) {
            coordenadas = polylineObject.geometry?.paths[0]
            coordenadas.push([event.mapPoint.longitude, event.mapPoint.latitude])
            const polyline = new Polyline({
                type: "polyline",
                paths: [coordenadas]
            })
            polylineObject.geometry = polyline;
        }

    }
}

