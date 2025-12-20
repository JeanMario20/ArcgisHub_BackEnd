import './bufferWidget.css';
import { type ReactNode, type MouseEvent, useEffect, useRef, type RefObject, useState } from "react";
import { useMap } from '../../context/viewContext';
import Graphic from "@arcgis/core/Graphic.js"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Polyline from "@arcgis/core/geometry/Polyline";
import CreateBuffer from './CreateBuffer';
import DrawPoint from './DrawPoint';
import DrawPolygon from './DrawPolygon';
import ButtonWidget from '../ButtonWidgets/ButtonWidget';

interface collection {
    view: RefObject<__esri.MapView | null>,
    event: __esri.ViewClickEvent,
    coordenadasPoints: number[][],
    bufferLayer: React.RefObject<GraphicsLayer | null>,
}

interface typeAnalisys {
    type: string
}


interface ButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
}

function Button({ onClick, children }: ButtonProps) {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    )
}


function Div({ children }) {
    return (
        <div id="bufferContainerInfo">{children}</div>
    )
}

interface Props{
    containerVisibleWidget: string
    setContainerVisibleWidget: React.Dispatch<React.SetStateAction<string>>;
}


function BufferWidget({ containerVisibleWidget, setContainerVisibleWidget }: Props) {
    const [containerVisible, setContainerVisible] = useState(false);
    const [isDrawPolyline, setIsDrawPolyline] = useState<boolean>(false);
    const [isDrawPoint, setIsDrawPoint] = useState<boolean>(false);
    const [isDrawPolygon, setIsDrawPolygon] = useState<boolean>(false);
    const [actualizar, setActualizar] = useState(0);
    const [readyButtonInforme, setReadyButtonInforme] = useState<boolean>(true) //para mostrar el boton disponible solo cambiar el estado a true
    const [toggleButtonInforme, setToggleButtonInforme] = useState<boolean>(false);
    const { clickRef } = useMap()
    const isDrawPolylineRef = useRef(isDrawPolyline)
    const isDrawPointRef = useRef(isDrawPoint)
    const isDrawPolygonRef = useRef(isDrawPolygon)
    const { bufferLayer } = useMap()
    //const view = clickRef;
    const coordenadasPoints: number[][] = [];
    const coordenadasPolyline: number[] = []
    const trazoCounter = { trazo: 0 };
    const [activateBuffer, setActivateBuffer] = useState(true);
    const [typeBufferAnalisys, setTypeBufferAnalisys] = useState<typeAnalisys>({ type: "" });
    const [labelBuDistance,setLabelBuDistance] = useState<number>()
    const [labelBuUnit, setlabelBuUnit] = useState<string>("")
    const [buttonActivate, setButtonActivate] = useState<string>("");
    //const buttonDrawPolylineButton = useRef<HTMLButtonElement>(null);

    function Input({ onInputChange, typeText, name, id }: any) {
        return (
            <>
                {typeText === "select" && (
                    <select name="selectedFruit" value={labelBuUnit} id={id}>
                        <option value="apple">Apple</option>
                        <option value="banana">Banana</option>
                        <option value="orange">Orange</option>
                    </select>
                )}
                {typeText !== "select" && (
                    <input type={typeText} onChange={(e) => onInputChange(e.target.value)} name={name} id={id} />
                )}

            </>
        )
        
    }

    interface ButtonDrawsProps {
        onClick: () => void;
        ref?: React.Ref<HTMLButtonElement>
        activate: boolean
        viewBox: string
        d: string
    }

    interface ButtonInformeProps {
        onClick?: () => void;
        activate: boolean;
        isReady: boolean;
        children: string;
    }

    const ButtonDraws: React.FC<ButtonDrawsProps> = ({ onClick, activate, viewBox, d }) => {
        return (
            <button
                onClick={onClick}
                className={`flex justify-center items-center border-2 text-xl p-2 m-2 shadow h-12 w-12 rounded-xl cursor-pointer 
                    ${activate ? "bg-sky-600 text-white" : "bg-white text-black"}`}>
                <svg className="w-10 h-10" viewBox={viewBox}>
                    <path d={d} fill="currentColor" />
                </svg>
            </button>
        );
    };

    const ButtonInforme: React.FC<ButtonInformeProps> = ({ onClick, activate, isReady, children }) => { //el isReady se activara cuando se finalice el analisis del buffer
        return (
            //dos if iternarios
            <>
                {
                    isReady ? (
                        <button
                            onClick={onClick}
                            className="w-20 h-11 cursor-pointer bg-gray-200 rounded-xl "
                        >
                            {children}
                        </button>
                    ) : (
                        <button
                            disabled
                            onClick={onClick}
                                className="w-20 h-11 cursor-pointer bg-gray-200 rounded-xl opacity-20"
                        >
                            {children}
                        </button>
                    )
                }   
                {
                    activate ? (
                        <div className="fixed top-134 left-54">
                            {/* div botón para mostrar los tipos de informes para cuando esté listo el análisis más reciente */}
                            <button type="button" className="w-15 h-11 mr-2 cursor-pointer bg-gray-200 rounded-xl">
                                excel
                            </button>
                            <button type="button" className="w-15 h-11 cursor-pointer bg-gray-200 rounded-xl">
                                pdf
                            </button>
                        </div>
                    ) : null
                }

                
            </>
        )
    }

    useEffect(() => {
        isDrawPolylineRef.current = isDrawPolyline;
        isDrawPointRef.current = isDrawPoint;
        isDrawPolygonRef.current = isDrawPolygon
        //setButtonActivate("")
        const handlerClick = clickRef.current?.on("click", (event) => {
            if (isDrawPolylineRef.current) {
                DibujarPolyline(clickRef, event, coordenadasPoints, trazoCounter, bufferLayer)
                coordenadasPolyline.push([event.mapPoint.longitude, event.mapPoint.latitude]);
                setActualizar(prev => prev + 1)
                return 
            }
            if (isDrawPointRef.current) {
                const props: collection = {
                    /*clickRef*/
                    event,
                    coordenadasPoints,
                    bufferLayer,
                }
                DrawPoint(props)
                return 
            }
            if (isDrawPolygonRef.current) {
                DrawPolygon(clickRef, event, bufferLayer)
            }

        })
        const handlerDoubleClick = clickRef.current?.on("double-click", () => {
            setButtonActivate("")
            setIsDrawPolyline(prev => !prev);
            //poner para desactivar los dibujos

        })

        return () => {
            handlerClick?.remove();
            handlerDoubleClick?.remove();
        };

    }, [isDrawPolyline, isDrawPoint, typeBufferAnalisys, isDrawPolygon])

    function ButtonAnalisis({ param, children }: ButtonProps) {
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

    function setChangedBuffer() {
        setActivateBuffer(false);
    }
    function retrocederDibujo() {
        const graphics = bufferLayer.current?.graphics
        if (!graphics || graphics.length === 0) return;


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

    function startDrawPolyline() {
        setIsDrawPoint(false)
        setButtonActivate(prev => (prev === "b1" ? "" : "b1"))
        setIsDrawPolyline(prev => !prev)
        setIsDrawPolygon(false)
        setTypeBufferAnalisys({ type: "polylineBuffer" })
    }
    function startDrawPoint() {
        setIsDrawPoint(prev => !prev)
        setButtonActivate(prev => (prev === "b2" ? "" : "b2"))
        setIsDrawPolyline(false)
        setIsDrawPolygon(false)
        setTypeBufferAnalisys({ type: "pointBuffer" })
    }
    
    function startDrawPolygon() {
        setIsDrawPoint(false)
        setButtonActivate(prev => (prev === "b3" ? "": "b3"))
        setIsDrawPolyline(false)
        setIsDrawPolygon(prev => !prev)
        setTypeBufferAnalisys({ type: "polygonBuffer" })
    }

    function prepararButtonInforme() {
        setReadyButtonInforme(prev => !prev)
    }

    function muestraInforme() {
        setToggleButtonInforme(prev => !prev)
    }

    function appearsWidgetContainer() {
        setContainerVisible(!containerVisible)
    }

    const appearsWidget = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setContainerVisible(!containerVisible)
    }
    return (
        <>
            <ButtonWidget
                onClick={() => containerVisibleWidget === "buferAnalis" ? setContainerVisibleWidget("") : setContainerVisibleWidget("buferAnalis")}
                buttonClass="flex items-center justify-center w-14 h-14  transition duration-100 bg-sky-300 hover:bg-sky-600 active:bg-sky-800  rounded-xl overflow-visible ml-3 mr-3 cursor-pointer"
                svgClass="w-10 h-10 text-gray-800 dark:text-white"
                d="M360-240v-80h480v80H360Zm0-200v-80h480v80H360ZM120-640v-80h720v80H120Z"
                viewBox="0 -960 960 960"
            />
            {containerVisibleWidget === "buferAnalis" ?
                <div>
                    {/*<Button onClick={startDrawPolyline()}>Polyline</Button>
                    <Button onClick={startDrawPoint}>Point</Button>
                    <Button onClick={startDrawPolygon}>Polygon</Button>
                    <Button onClick={borrarPolyline}>Borrar todo</Button>
                    <Button onClick={retrocederDibujo}>Retroceder</Button>*/}

                    <div className='fixed border-2 border-gray-200 shadow-sm rounded-xl bg-white m-5 w-100 h-150 top-35 left-1'>
                        <div className='flex items-center justify-center bg-blue-700 w-auto rounded-xl h-10 text-white font-bold '>
                            <p>Analisis Buffer</p>

                            <button onClick={() => setContainerVisibleWidget("")}>
                                <svg className="absolute top-3 left-90 w-5 h-5 text-gray-800 dark:text-white cursor-pointer" onClick={() => setContainerVisibleWidget("")} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                </svg>
                            </button>
                        </div>

                        <form className='p-5' action="">
                            <p className='mb-5'>Analisis disponibles</p>
                            <ul className='grid md:grid-cols-2 w-50 h-12 bg-gray-100 rounded-xl'>
                                <input type="checkbox" id='buffer1Opt' className='hidden peer' value="" />
                                <label className='inline-flex items-center justify-around w-11/12 text-gray-50 m-1 bg-gray-100 border-2 rounded-lg cursor-pointer dark:hover:text-gray-300' htmlFor="buffer10pt">
                                    <div className="block">
                                        <div className="text-sm font-bold text-gray-500">Buffer1</div>
                                    </div>
                                </label>
                                <input type="checkbox" id='buffer1Opt' className='hidden peer' value="" />
                                <label className='inline-flex items-center justify-around w-11/12 text-gray-50 m-1 bg-gray-100 border-2 rounded-lg cursor-pointer dark:hover:text-gray-300' htmlFor="buffer10pt">
                                    <div className="block">
                                        <div className="text-sm font-bold text-gray-500">Buffer1</div>
                                    </div>
                                </label>
                            </ul>

                            <p className='mt-5'>Elige tu dibujo</p>
                            <div className='flex flex-wrap items-center mt-2'>
                                <ButtonDraws
                                    onClick={startDrawPolyline}
                                    activate={buttonActivate === "b1"}
                                    viewBox="0 0 100 100"
                                    d={"M50 37.45c-6.89 0-12.55 5.66-12.55 12.549c0 6.89 5.66 12.55 12.55 12.55c6.655 0 12.112-5.294 12.48-11.862a3.5 3.5 0 0 0 .07-.688a3.5 3.5 0 0 0-.07-.691C62.11 42.74 56.653 37.45 50 37.45zm0 7c3.107 0 5.55 2.442 5.55 5.549s-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.549 5.55-5.549z"}
                                />

                                <ButtonDraws
                                    onClick={startDrawPoint}
                                    activate={buttonActivate === "b2"}
                                    viewBox="0 0 100 100"
                                    d={"M50 37.45c-6.89 0-12.55 5.66-12.55 12.549c0 6.89 5.66 12.55 12.55 12.55c6.655 0 12.112-5.294 12.48-11.862a3.5 3.5 0 0 0 .07-.688a3.5 3.5 0 0 0-.07-.691C62.11 42.74 56.653 37.45 50 37.45zm0 7c3.107 0 5.55 2.442 5.55 5.549s-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.549 5.55-5.549z"}
                                />
                                
                                <ButtonDraws
                                    onClick={startDrawPolygon}
                                    activate={buttonActivate === "b3"}
                                    viewBox="0 0 24 24"
                                    d={"M20 3.456L12 9.28V9H9v.433l-5-3.31V4H1v3h1v13H1v3h3v-1h16v1h3v-3h-1V4h1V1h-3zM10 10h1v1h-1zM2 5h1v1H2zm0 17v-1h1v1zm20 0h-1v-1h1zm-1-2h-1v1H4v-1H3V7h.512L9 10.632V12h3v-1.483L20.952 4H21zm1-18v1h-1V2z"}
                                />

                                <ButtonDraws
                                    //onClick={() => setButtonActivate("b4")}
                                    activate={buttonActivate === "b4"}
                                    viewBox="0 0 16 16"
                                    d={"m 4 0 c -1.644531 0 -3 1.355469 -3 3 v 10 c 0 1.644531 1.355469 3 3 3 h 1 c 0.550781 0 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 h -1 c -0.570312 0 -1 -0.429688 -1 -1 v -10 c 0 -0.570312 0.429688 -1 1 -1 h 5.585938 l 3.414062 3.414062 v 7.585938 c 0 0.570312 -0.429688 1 -1 1 h -1 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 h 1 c 1.644531 0 3 -1.355469 3 -3 v -8 c 0 -0.265625 -0.105469 -0.519531 -0.292969 -0.707031 l -4 -4 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 4 6 c -0.265625 0 -0.519531 0.105469 -0.707031 0.292969 l -3 3 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 l 1.292969 -1.292969 v 6.585938 h 2 v -6.585938 l 1.292969 1.292969 c 0.390625 0.390625 1.023437 0.390625 1.414062 0 s 0.390625 -1.023437 0 -1.414062 l -3 -3 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 0"}
                                />                                

                            </div>

                            <p className='mt-2'>Especificación de área analisis.</p>

                            <div>
                                <label className='block mt-2 mb-3' htmlFor="label">Introduce valor</label>
                                <input className="h-10 w-40 p-3 bg-gray-100 outline-2 outline-gray-200/80 inset-shadow-sm rounded-lg text-gray-400 focus:outline-1 focus:outline-sky-500 focus:shadow-xl" type="text" id='label' placeholder='introduce text' />
                                {/* https://uiverse.io/RashadGhzi/smooth-skunk-12 */}
                            </div>

                            <div className='mt-10'>
                                <button type="button" className='w-40 h-11 mr-2 cursor-pointer bg-gray-200 rounded-xl hover:bg-sky-400'>Ejecutar Analisis</button>
                                <ButtonInforme
                                    onClick={muestraInforme}
                                    activate={toggleButtonInforme}
                                    isReady={readyButtonInforme}>
                                    Informe
                                </ButtonInforme>                  
                            </div>
                        </form>
                    </div>
                </div>
                : null}
        </>
    )
}
interface Props {
    containerVisibleWidget: string;
    setContainerVisibleWidget: React.Dispatch<React.SetStateAction<string>>;
}

export default function BufferTemplate({ containerVisibleWidget, setContainerVisibleWidget }: Props) {
    return (
        <BufferWidget containerVisibleWidget={containerVisibleWidget} setContainerVisibleWidget={setContainerVisibleWidget} />
    )
}

function DibujarPolyline(view: RefObject<__esri.MapView | null>, event: __esri.ViewClickEvent, coordenadas: number[][], ref: { trazo: number }, bufferLayer: React.RefObject<GraphicsLayer | null>) {

    const graphics = bufferLayer.current?.graphics
    const longitud = event.mapPoint.longitude
    const latitud = event.mapPoint.latitude
    if (!graphics) return

    const polylineObject = graphics?.find((layer) => {
        return layer.geometry?.type == "polyline"
    })

    const point = {
        type: "point", // autocasts as new Point()
        longitude: event.mapPoint.longitude,
        latitude: event.mapPoint.latitude,
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
        type: "point"
    };

    

    const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: pointAtt
    });

    //view.current?.graphics.add(pointGraphic); <-- dibujar en el mapa
    graphics?.add(pointGraphic);
    coordenadas.push([longitud, latitud]);
    const countGraphics = bufferLayer.current?.graphics.length;


    if (countGraphics != undefined && countGraphics == 1 && polylineObject == undefined) {

        const polyline = new Polyline({
            type: "polyline",
            paths: [longitud, latitud]
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
            type: "polylineBuffer",
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

            const PathsActualizado = [...polylineObject.geometry.paths[0], [longitud, latitud]]
            polylineObject.geometry = new Polyline({ paths: [PathsActualizado] })
        }

    }
}

