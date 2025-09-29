import React, { useRef, useState } from "react"
import { FaMinus } from "react-icons/fa6";
import axios from 'axios'
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function InputOTP({ length = 6, onComplete }) {
    const [otp, setOtp] = useState(Array(length).fill(""))
    const inputs = useRef([])

    const handleChange = (e, idx) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(-1)
        if (!value) return
        const next = [...otp]
        next[idx] = value
        setOtp(next)

        if (idx < length - 1) {
            inputs.current[idx + 1].focus()
        }
        if (next.join("").length === length && !next.includes("")) {
            onComplete?.(next.join(""))
        }
    }

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            e.preventDefault()
            const next = [...otp]
            if (next[idx]) {
                next[idx] = ""
                setOtp(next)
            } else if (idx > 0) {
                inputs.current[idx - 1].focus()
                const prev = [...otp]
                prev[idx - 1] = ""
                setOtp(prev)
            }
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length).split("")
        const next = Array(length).fill("")
        for (let i = 0; i < pasted.length; i++) {
            next[i] = pasted[i]
        }
        setOtp(next)
        if (pasted.length === length) {
            onComplete?.(next.join(""))
        }
    }

    return (
        <div className="flex items-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
                <React.Fragment key={idx}>
                    <input
                        ref={(el) => (inputs.current[idx] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        maxLength={1}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                    {idx === 2 && <InputOTPSeparator />}
                </React.Fragment>
            ))}
        </div>
    )
}

function InputOTPSeparator() {
    return (
        <div className="flex items-center justify-center w-6">
            <FaMinus className="w-4 h-4 text-gray-400" />
        </div>
    )
}
const VerificationModel = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate()
    const email = localStorage.getItem('email');
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false)

    const handleComplete = (otp) => {
        setCode(otp);  // always keep as string
    };

    const checkOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, {
                email,
                OTP: code
            });
            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <div className="flex flex-col border-2 p-4 border-gray-300 rounded-2xl items-center justify-center min-h-screen gap-4">
                <img loading="lazy" src="/favicon.png" alt="Logo" className="w-30" />
                <h2 className="text-xl font-semibold">Enter OTP</h2>
                <p>
                    An OTP has sent to your Registered Email
                </p>
                <form onSubmit={checkOTP}>
                    <InputOTP length={6} onComplete={handleComplete} />
                    <button type="submit" disabled={loading} className="mt-5 w-full ">
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default VerificationModel
