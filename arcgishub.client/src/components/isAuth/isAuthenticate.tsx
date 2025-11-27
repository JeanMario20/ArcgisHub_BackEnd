import { useNavigate } from 'react-router-dom';
import React, { FC, ReactNode } from 'react';

interface Props {
    children: ReactNode
}

const IsAuthenticate: FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    callAuthApi("https://localhost:5187/api/Auth/retriveTokenData")
    return <>{ children }</>
    


    async function callAuthApi(url: string) {
        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            return data
            
        } catch (error) {
            console.log("El usuario no esta autorizado a entrar" + error);
            return Nav("/Register")
        }
    }

    function Nav(url: string) {
        navigate(url);

    }
}





export default IsAuthenticate