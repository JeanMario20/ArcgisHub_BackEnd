import { useForm } from "../LoginUsers/UseFormHandler";
import { useNavigate } from 'react-router-dom';

function RegistroUsuario() {
    const initialState = {
        userName: "",
        password_hash: "",
        password_salt: "",
        rol: "",
        team: ""
    }

    const navigate = useNavigate();

    function GoToPage(url: string) {
        try {
            navigate(url);
        } catch (error) {
            console.log("ha ocurrido un error con el redireccionado", error)
        }

    }

    async function RegisterUserCallback() {
        try {
            const res = await fetch("https://localhost:5187/api/Auth/Register", {
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


            const data = await res.json();
            if (data.duplicado == false) {
                GoToPage("/Entrandohub");
            }
            if (data.duplicado == true) {
                alert("usuario ya se encuentra en la base de datos")
            }



        } catch (error) {
            console.error("Error:", error);
        }
    }

    const { onChange, onSubmit, values } = useForm(
        RegisterUserCallback,
        initialState
    );

    return (
        <>
            <h2>ingresa nuevo usuario.</h2>
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
                    <button type="submit">Registrar</button>
                </div>
            </form>
        </>
    );
}

export default RegistroUsuario