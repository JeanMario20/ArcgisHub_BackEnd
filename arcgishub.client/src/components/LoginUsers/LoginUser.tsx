import { useForm } from "./UseFormHandler";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    interface Props {
        onClick: () => void;
        children?: React.ReactNode;
    }

    const initialState = {
        userName: "",
        password_hash: "",
        password_salt: "",
        rol: "",
        team: ""
    };

    const navigate = useNavigate();

    function GoToPage(url: string) {
        try {
            navigate(url);
        } catch (error) {
            console.log("ha ocurrido un error con el redireccionado", error)
        }
    }


    async function LoginUserCallback() {
        try {
            const res = await fetch("https://localhost:5187/api/Auth/Login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(values),
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
              
            try {
                const data = await res.json();
                if (data == true) {
                    GoToPage("/Entrandohub");
                }
                if (data == false) {
                    alert("los datos que se proporcionaron fueron incorrectos")
                }
            } catch (e) {
                console.log("ha ocurrido un error en el registro de sesion:" + e);
            }


        } catch (error) {
            console.error("Error:", error);
        }

    }

    const { onChange, onSubmit, values } = useForm(
        LoginUserCallback,
        initialState
    );

    function ButtonLogin({ onClick, children }: Props) {
        return (
            <button onClick={onClick}>{children}</button>
        )
    }

    return (
        <>
            <h2>Ingresa el usuario registrado</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        name="userName"
                        id="userName"
                        type="text"
                        placeholder="UserName"
                        onChange={onChange}
                        required
                    />
                    <input
                        name="password_hash"
                        id="password_hash"
                        type="password"
                        placeholder="Password"
                        onChange={onChange}
                        required
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
            <ButtonLogin onClick={() => GoToPage("/Register")}>Registrar nuevo usuario</ButtonLogin>
        </>
    );
}