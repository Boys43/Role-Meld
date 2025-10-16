import axios from "axios";
import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Lucide React Icons
import { User, Mail, Lock, Briefcase, Eye, EyeOff, XCircle, CheckCircle, Search, Building } from "lucide-react";

const RegisterModel = ({ setRegStep }) => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate()

    // Form Data States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' (Job Seeker) or 'recruiter'

    // State for Password Visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    // --- Real-time Password Match Check ---
    const passwordsMatch = useMemo(() => {
        // Only check if both fields have input
        if (password.length > 0 && confirmPassword.length > 0) {
            return password === confirmPassword;
        }
        // Return null if one or both fields are empty, so no message is shown initially
        return null;
    }, [password, confirmPassword]);

    const register = async (e) => {
        e.preventDefault();

        // Final check before API call
        if (password.length === 0 || confirmPassword.length === 0) {
            toast.error("Please enter and confirm your password.");
            return;
        }

        if (!passwordsMatch) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        localStorage.setItem("email", email);
        axios.defaults.withCredentials = true;

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password, role });

            if (data.success) {
                toast.success(data.message);
                setRegStep(1);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    // Component for a single role selection card/toggle
    const RoleToggle = ({ value, label, icon: Icon, isSelected, onClick }) => (
        <div
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 w-full md:w-1/2 ${isSelected
                    ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 shadow-md shadow-[var(--primary-color)]/20'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
            onClick={onClick}
        >
            <Icon size={24} className={`${isSelected ? 'text-[var(--primary-color)]' : 'text-gray-500'}`} />
            <span className={`text-sm font-semibold mt-2 ${isSelected ? 'text-[var(--primary-color)]' : 'text-gray-700'}`}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex w-full justify-center items-center bg-white">
            <div className="w-full px-8 md:px-32 lg:px-24">
                <form className="bg-white rounded-xl flex flex-col gap-2 border border-gray-200 p-8 shadow-lg" onSubmit={register}>
                    <h1 className="text-gray-800 font-extrabold text-3xl mb-1">Join Us</h1>
                    <p className="text-sm font-normal text-gray-500 mb-4">Select your account type to proceed.</p>

                    {/* Name Field */}
                    <div className="flex items-center border-2 py-3 px-4 rounded-full focus-within:border-[var(--primary-color)] transition-colors">
                        <User size={20} className="text-gray-400" />
                        <input
                            className="pl-3 w-full outline-none border-none text-sm"
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center border-2 py-3 px-4 rounded-full focus-within:border-[var(--primary-color)] transition-colors">
                        <Mail size={20} className="text-gray-400" />
                        <input
                            className="pl-3 w-full outline-none border-none text-sm"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field with Toggle */}
                    <div className="flex items-center border-2 py-3 px-4 rounded-full focus-within:border-[var(--primary-color)] transition-colors">
                        <Lock size={20} className="text-gray-400" />
                        <input
                            className="pl-3 w-full outline-none border-none text-sm"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 hover:text-[var(--primary-color)] transition-colors cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    {/* CONFIRM Password Field with Toggle & Feedback */}
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center border-2 py-3 px-4 rounded-full focus-within:border-[var(--primary-color)] transition-colors">
                            <Lock size={20} className="text-gray-400" />
                            <input
                                className="pl-3 w-full outline-none border-none text-sm"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-500 hover:text-[var(--primary-color)] transition-colors cursor-pointer"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>

                        {/* Real-Time Match Feedback */}
                        {passwordsMatch !== null && (
                            <div className={`flex items-center gap-1.5 ml-2 mt-2 transition-opacity ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordsMatch ? (
                                    <>
                                        <CheckCircle size={16} />
                                        <span className="text-xs font-medium">Passwords Match!</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} />
                                        <span className="text-xs font-medium">Passwords do not match.</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Role Selection Toggle Boxes (NEW) */}
                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                        <RoleToggle
                            value="user"
                            label="Job Seeker"
                            icon={Search}
                            isSelected={role === 'user'}
                            onClick={() => setRole('user')}
                        />
                        <RoleToggle
                            value="recruiter"
                            label="Recruiter"
                            icon={Building}
                            isSelected={role === 'recruiter'}
                            onClick={() => setRole('recruiter')}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        // Disable button if loading, passwords don't match, or required fields are empty
                        disabled={loading || password.length === 0 || confirmPassword.length === 0 || !passwordsMatch}
                        className="block w-full bg-[var(--primary-color)] mt-4 py-3 rounded-full hover:bg-[var(--primary-color)]/90 transition-all duration-300 text-white font-semibold text-lg shadow-md shadow-[var(--primary-color)]/30"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {/* Footer Links */}
                    <div className="flex justify-between mt-4 text-sm">
                        <span className="text-gray-500 hover:text-[var(--primary-color)] cursor-pointer transition-colors">
                            Forgot Password?
                        </span>

                        <Link
                            to="/login"
                            className="text-gray-500 hover:text-[var(--primary-color)] cursor-pointer transition-colors font-medium"
                        >
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModel;