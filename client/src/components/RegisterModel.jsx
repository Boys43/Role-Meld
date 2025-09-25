import axios from "axios";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const RegisterModel = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate()

    // Data to sent
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user');


    const register = async (e) => {
        e.preventDefault()
        axios.defaults.withCredentials = true;
        try {

            const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password, role })
            if (data.success) {
                toast.success(data.message)
                navigate('/login');
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error)
        }
    }
    return <>
        <div className="flex w-full lg:w-1/2 justify-center items-center bg-white" >
            <div className="w-full px-8 md:px-32 lg:px-24">
                <form className="bg-white rounded-md flex flex-col gap-2 shadow-2xl p-5" onSubmit={register}>
                    <h1 className="text-gray-800 font-bold text-2xl mb-1">Register</h1>
                    <p className="text-sm font-normal text-gray-600 mb-8">Create a new account</p>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input id="name" className=" pl-2 w-full outline-none border-none" type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <input id="email" className=" pl-2 w-full outline-none border-none" type="email" name="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <input className="pl-2 w-full outline-none border-none" type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    </div>
                    <div>
                        <select className="w-full border-2 rounded-xl p-2 outline-none" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>
                    <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Register</button>
                    <div className="flex justify-between mt-4">
                        <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Forgot Password ?</span>

                        <Link to="/login" className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Already have an account</Link>
                    </div>

                </form>
            </div>
        </div>
    </>
};

export default RegisterModel;