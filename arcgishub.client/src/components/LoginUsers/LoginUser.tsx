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
            <p className='text-center'>No tienes una cuenta? <span onClick={onClick} className='cursor-pointer font-bold'>{children}</span></p>
        )
    }

    return (
        <>
            <div className="w-screen h-screen bg-gradient-to-br from-green-700 via-white to-blue-700">
                <div className='flex items-center justify-center h-screen flex-col'>
                    <form onSubmit={onSubmit} className='border-solid border-2 rounded-md w-130 mt-10 p-10 bg-white'>
                        <div className='flex items-center justify-center flex-col mb-10'>
                            <img src=".\src\assets\arcgisLogo.svg" className='h-50' />
                            <p className='text-3xl font-bold mb-5'>Login your account</p>
                            <p>get start in your geolocalization app right now!</p>
                        </div>
                        <label htmlFor="userName" className='block'>Username/Email*</label>

                        <div className='relative'>
                            <input
                                className='block border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md mt-2 mb-4 h-10 min-w-full p-3 pl-10'
                                name="userName"
                                id="userName"
                                type="text"
                                placeholder="UserName"
                                onChange={onChange}
                                required
                            />
                            <svg className='absolute bottom-2.5 pointer-events-none' fill="#000000" width="40px" height="20px" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z"></path></svg>
                        </div>


                        <label htmlFor="password_hash" className='block'>Password</label>
                        <div className='relative'>
                            <input
                                className='block border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md mt-2 mb-4 h-10 min-w-full p-3 pl-10'
                                name="password_hash"
                                id="password_hash"
                                type="password"
                                placeholder="Password"
                                onChange={onChange}
                                required
                            />
                            <svg className='absolute bottom-2.5 pointer-events-none' version="1.1" id="PasswordSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="20px" viewBox="0 0 203.096 203.096"><g><path d="M153.976,73.236h-3.308V49.115C150.669,22.033,128.634,0,101.549,0C74.465,0,52.43,22.033,52.43,49.115v24.121H49.12 c-9.649,0-17.5,7.851-17.5,17.5v94.859c0,9.649,7.851,17.5,17.5,17.5h104.856c9.649,0,17.5-7.851,17.5-17.5V90.736 C171.476,81.087,163.626,73.236,153.976,73.236z M67.43,49.115C67.43,30.304,82.736,15,101.549,15 c18.813,0,34.119,15.304,34.119,34.115v24.121H67.43V49.115z M156.476,185.596c0,1.355-1.145,2.5-2.5,2.5H49.12 c-1.355,0-2.5-1.145-2.5-2.5V90.736c0-1.355,1.145-2.5,2.5-2.5H59.93h83.238h10.808c1.355,0,2.5,1.145,2.5,2.5V185.596z" /><path d="M101.547,116.309c-4.142,0-7.5,3.357-7.5,7.5v28.715c0,4.143,3.358,7.5,7.5,7.5c4.142,0,7.5-3.357,7.5-7.5v-28.715 C109.047,119.666,105.689,116.309,101.547,116.309z" /></g></svg>
                        </div>

                        <p className='mt-5 mb-5 cursor-pointer'>reset password</p>

                        <button type="submit" className='border rounded-md min-w-full h-12 mb-5 cursor-pointer bg-black text-white'>Login user</button>

                        <div className=' flex items-center justify-center'>
                            <div className=' bg-gray-700 h-0.5 w-2/5 mb-5 mt-5 rounded-md'></div>
                        </div>

                        <ButtonLogin onClick={() => GoToPage("/Register")}>Registrar nuevo usuario</ButtonLogin>

                    </form>

                </div>
            </div>
            
        </>
    );
}