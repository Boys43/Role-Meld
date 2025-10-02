import React from 'react'
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const { backendUrl, userData } = useContext(AppContext);
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const [changePasswordLoading, setChangePasswordLoading] = useState(false)
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setChangePasswordLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/change-password`, {
                password: oldPassword,
                newPassword: newPassword,
                email: userData.email
            });

            if (data.success) {
                toast.success(data.message);
                setOldPassword("");
                setNewPassword("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // Properly handle Axios errors
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message || "Something went wrong");
            }
        } finally {
            setChangePasswordLoading(false);
        }
    };


    return (
        <div className='w-full min-h-[calc(100vh-4.6rem)] overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
            <div className='max-w-2xl mx-auto p-6 md:p-8 flex flex-col shadow-lg rounded-xl bg-white border border-gray-200'>
                <div className='flex items-center gap-3 mb-2'>
                    <div className='p-2 bg-blue-100 rounded-lg'>
                        <Lock className='w-6 h-6 text-blue-600' />
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Change Your Password
                    </h1>
                </div>
                <p className='text-gray-600 text-sm mb-8'>
                    Keep your account secure by updating your password regularly
                </p>

                <div className='w-full flex flex-col items-center'>
                    <form onSubmit={onSubmitHandler} className='w-full max-w-md space-y-5'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 block'>
                                Current Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    name="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all border-2 border-gray-300 rounded-lg"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                >
                                    {showOldPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                </button>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 block'>
                                New Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all border-2 border-gray-300 rounded-lg"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                >
                                    {showNewPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                </button>
                            </div>
                        </div>

                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700'>
                            <p className='font-medium mb-1'>Password requirements:</p>
                            <ul className='list-disc list-inside space-y-0.5 text-gray-600'>
                                <li>At least 8 characters long</li>
                                <li>Contains uppercase and lowercase letters</li>
                                <li>Includes at least one number</li>
                            </ul>
                        </div>

                        <button
                            type='submit'
                            disabled={changePasswordLoading}
                        >
                            {changePasswordLoading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword