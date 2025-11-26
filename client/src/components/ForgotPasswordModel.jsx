import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

const ForgotPasswordModel = ({ onBackToLogin }) => {
    const { backendUrl } = useContext(AppContext)
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    axios.defaults.withCredentials = true

    const handleSendOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-password-reset-otp`, { email })

            if (data.success) {
                toast.success(data.message)
                setStep(2)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-password-reset-otp`, { email, otp })

            if (data.success) {
                toast.success(data.message)
                setStep(3)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'OTP verification failed')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password-with-otp`, {
                email,
                otp,
                newPassword
            })

            if (data.success) {
                toast.success(data.message)
                // Reset form and go back to login
                setEmail('')
                setOtp('')
                setNewPassword('')
                setConfirmPassword('')
                setStep(1)
                onBackToLogin()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Password reset failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex w-full justify-center items-center">
            <div className="w-full px-8 md:px-32 lg:px-24">
                <div className="bg-white rounded-2xl border border-gray-300 p-10 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-1">
                        <button
                            onClick={onBackToLogin}
                            className="text-gray-500 hover:text-[var(--primary-color)] transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-gray-800 font-bold text-2xl">Forgot Password</h1>
                    </div>
                    <p className="text-sm font-normal text-gray-600 mb-6">
                        {step === 1 && 'Enter your email to receive an OTP'}
                        {step === 2 && 'Enter the OTP sent to your email'}
                        {step === 3 && 'Create your new password'}
                    </p>

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="flex flex-col gap-3">
                            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                                <Mail size={18} className="text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="pl-2 py-1 text-sm w-full outline-none border-none text-[var(--primary-color)]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="primary-btn"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-3">
                            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                                <Lock size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="pl-2 py-1 text-sm w-full outline-none border-none text-[var(--primary-color)]"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="primary-btn"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-gray-500 hover:text-[var(--primary-color)] transition-colors"
                            >
                                Resend OTP
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                            <div className="flex items-center border-2 py-2 px-3 rounded-2xl relative">
                                <Lock size={18} className="text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    className="text-[var(--primary-color)] pl-2 py-1 text-sm pr-8 w-full outline-none border-none"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="flex items-center border-2 py-2 px-3 rounded-2xl relative">
                                <Lock size={18} className="text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    className="text-[var(--primary-color)] pl-2 py-1 text-sm pr-8 w-full outline-none border-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="primary-btn"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordModel
