import ButtonWidget from '../ButtonWidgets/ButtonWidget';

interface fecthProps {
    data: string;
}

async function joinTeam({data}: fecthProps) : Promise<string> {
    const response = await fetch("https://localhost:5187/api/Team/JoinTeam",{
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ idTeamToJoin: data }),
        credentials: "include"
    });

    if(!response.ok){
        throw new Error("hubo un error al intentar unirse al equipo")
    }
    const dataResponse = await response.json()
    
    if(dataResponse.success){
        const mensajes: Record<number, string> = {
            1: "Bienvenido al equipo Sky",
            2: "Bienvenido al equipo Rock",
            3: "Bienvenido al equipo Petroleros",
            9: "Bienvenido al equipo Eco",
        };

        const mensaje = mensajes[dataResponse.team];
        if(mensaje){
            alert(mensaje)
        }
    }

    if(dataResponse.success == false){
        alert("ya pertenece a un equipo hable con el admin para un cambio de equipo");
    }

    return "finalizado"
    
}

interface Props {
    containerVisibleWidget: string;
    setContainerVisibleWidget: React.Dispatch<React.SetStateAction<string>>;
}
function JoinTeamsConfig({ containerVisibleWidget, setContainerVisibleWidget }: Props) {
    return ( 
    <>
        <ButtonWidget
            onClick={() => containerVisibleWidget === "teamSelection" ? setContainerVisibleWidget("") : setContainerVisibleWidget("teamSelection")}
            buttonClass="flex items-center justify-center w-14 h-14  transition duration-100 bg-sky-300 hover:bg-sky-600 active:bg-sky-800  rounded-xl overflow-visible ml-3 mr-3 cursor-pointer"
            svgClass="w-10 h-10 text-gray-800 dark:text-white"
            d="M12 10a4 4 0 1 0 0-8a4 4 0 0 0 0 8m-6.5 3a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5M21 10.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m-9 .5a5 5 0 0 1 5 5v6H7v-6a5 5 0 0 1 5-5m-7 5c0-.693.1-1.362.288-1.994l-.17.014A3.5 3.5 0 0 0 2 17.5V22h3zm17 6v-4.5a3.5 3.5 0 0 0-3.288-3.494c.187.632.288 1.301.288 1.994v6z"
            viewBox="0 0 24 24"
        />*
            {containerVisibleWidget === "teamSelection" ?
            <div className="fixed border-2 border-gray-200 shadow-sm rounded-xl bg-white m-5 w-100 h-150 top-35 left-1">
                <div className="flex items-center justify-center bg-blue-700 w-auto rounded-xl h-10 text-white font-bold">
                    <p>Equipos</p>
                    <button onClick={() => setContainerVisibleWidget("")}>
                        <svg className="absolute top-3 left-90 w-5 h-5 text-gray-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                    </button>
                </div>

                <button onClick={async () => {await joinTeam({data:"1"})}}>unirte al equipo sky</button>
                <br />
                <button onClick={async () => {await joinTeam({data:"2"})}}>unirte al equipo Rock</button>
                <br />
                <button onClick={async () => {await joinTeam({data:"3"})}}>unirte al equipo Petroleros</button>
                <br />
                <button onClick={async () => {await joinTeam({data:"9"})}}>unirte al equipo Eco</button>
            </div>: null
                
            }
    </>
    )
}


export default JoinTeamsConfig; 

