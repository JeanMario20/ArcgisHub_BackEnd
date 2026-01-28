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
            <div className="w-screen h-screen bg-gradient-to-br from-[#201e1e] to-[#2a52cb]">
                <div className='flex items-center justify-center w-screen h-screen ring-2 ring-gray-200 rounded-e-lg'>
                    <div className='grid grid-cols-2 w-150 h-100 ring-2 ring-gray-200 rounded-2xl place-items-center  2xl:w-300 2xl:h-180 lg:w-230 lg:h-140 bg-white'>
                        <div className='border w-full h-full'>
                            <img className='h-full rounded-2xl' src=".\src\assets\mapa-topografico.jpg" alt="" />
                        </div>
                        <div className='flex items-center justify-center'>
                            <form onSubmit={onSubmit} className='rounded-md h-90 w-70 p-5 bg-white lg:h-120 lg:w-100 2xl:h-160 2xl:w-140'>

                                <div className='flex items-center justify-center flex-col mb-5'>
                                    <img src="./assets/arcgisLogo.svg" className='h-20 lg:h-25 2xl:h-35' />
                                    <p className='text-base lg:text-lg 2xl:text-2xl font-bold mb-2'>Register a new Account</p>
                                    <p className='text-sm lg:text-base 2xl:text-xl'>Please introduce </p>
                                </div>

                                <label htmlFor="userName" className='hidden lg:block 2xl:text-xl'>Username/Email*</label>

                                <div className='relative'>
                                    <input placeholder='Username' type="text" id="userName" name="userName" onChange={onChange} required className='block border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md mt-2 mb-4 h-8 min-w-full p-3 pl-10 lg:h-10 2xl:h-12 placeholder-gray-200' />
                                    <svg className='absolute bottom-2.5 pointer-events-none w-10 h-4 lg:h-5 2xl:h-7' fill="#000000" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z"></path></svg>

                                </div>


                                <label htmlFor="password_hash" className='hidden lg:block 2xl:text-xl'>Password</label>
                                <div className='relative'>
                                    <input placeholder='Password' type="password" id="password_hash" name="password_hash" className='block border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md mt-2 mb-4 h-8 min-w-full p-3 pl-10 lg:h-10 2xl:h-12 placeholder-gray-200'/>
                                    <svg className='absolute bottom-2.5 pointer-events-none w-10 h-4 lg:h-5 2xl:h-7' version="1.1" id="PasswordSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 203.096 203.096"><g><path d="M153.976,73.236h-3.308V49.115C150.669,22.033,128.634,0,101.549,0C74.465,0,52.43,22.033,52.43,49.115v24.121H49.12 c-9.649,0-17.5,7.851-17.5,17.5v94.859c0,9.649,7.851,17.5,17.5,17.5h104.856c9.649,0,17.5-7.851,17.5-17.5V90.736 C171.476,81.087,163.626,73.236,153.976,73.236z M67.43,49.115C67.43,30.304,82.736,15,101.549,15 c18.813,0,34.119,15.304,34.119,34.115v24.121H67.43V49.115z M156.476,185.596c0,1.355-1.145,2.5-2.5,2.5H49.12 c-1.355,0-2.5-1.145-2.5-2.5V90.736c0-1.355,1.145-2.5,2.5-2.5H59.93h83.238h10.808c1.355,0,2.5,1.145,2.5,2.5V185.596z" /><path d="M101.547,116.309c-4.142,0-7.5,3.357-7.5,7.5v28.715c0,4.143,3.358,7.5,7.5,7.5c4.142,0,7.5-3.357,7.5-7.5v-28.715 C109.047,119.666,105.689,116.309,101.547,116.309z" /></g></svg>
                                </div>

                                <p className='mt-5 mb-5 cursor-pointer hidden'>reset password</p>

                                <button type="submit" className='border rounded-md min-w-full h-9 mb-5 lg:h-12 2xl:h-14 2xl:mt-5 cursor-pointer bg-black text-white'>Register new user</button>

                                <div className=' flex items-center justify-center 2xl:mt-12'>
                                    <div className=' bg-gray-700 h-0.5 w-2/5 mb-5 mt-2 rounded-md'></div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
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