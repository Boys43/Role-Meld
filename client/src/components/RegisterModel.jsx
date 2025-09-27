import axios from "axios";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { IoMdPerson } from "react-icons/io";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { SiHyperskill } from "react-icons/si";

const RegisterModel = ({ setRegStep }) => {
    const { backendUrl } = useContext(AppContext);

    // Data to sent
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user');

    const [loading, setLoading] = useState(false)
    const register = async (e) => {
        setLoading(true)
        e.preventDefault()
        localStorage.setItem("email", email);
        axios.defaults.withCredentials = true;
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password, role })
            if (data.success) {
                toast.success(data.message);
                setRegStep(1)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }
    return <>
        <div className="flex w-full justify-center items-center bg-white" >
            <div className="w-full px-8 md:px-32 lg:px-24">
                <form className="bg-white rounded-md flex flex-col gap-2 border border-gray-300 p-5" onSubmit={register}>
                    <h1 className="text-gray-800 font-bold text-2xl mb-1">Register</h1>
                    <p className="text-sm font-normal text-gray-600 mb-8">Create a new account</p>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                        <IoMdPerson className="text-gray-400" />
                        <input id="name" className=" pl-2 w-full outline-none border-none" type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                        <MdAlternateEmail className="text-gray-400" />
                        <input id="email" className=" pl-2 w-full outline-none border-none" type="email" name="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl ">
                        <FaLock className="text-gray-400" />
                        <input className="pl-2 w-full outline-none border-none" type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    </div>
                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl ">
                        <SiHyperskill className="text-gray-400"/>
                        <select className="w-full outline-none pl-2" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>
                    <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
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