import { useNavigate } from 'react-router-dom';
import React, { ReactNode, useEffect, useState } from 'react';

interface Props {
    children: ReactNode
}

const IsAuthenticate: FC<Props> = ({ children }) => {
    const [readyToRender, setReadyToRender] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate();
    useEffect(() => {

        callAuthApi()
        async function callAuthApi() {
        try {
            const response = await fetch("https://localhost:5187/api/Auth/retriveTokenData", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            data ? setReadyToRender(true) : setReadyToRender(false);
            setLoading(true);
            return readyToRender;
            
        } catch (error) {
            console.log("El usuario no esta autorizado a entrar" + error);
            return Nav("/Register")
        }
    }
    },[])
    if(loading){
        return <>{ readyToRender ? children : messageError}</>
    } else {
    }

    function Nav(url: string) {
        navigate(url);

    }
}

const messageError = () => {
    return alert("hubo un error en la autenticacion del usuario")
}





export default IsAuthenticate