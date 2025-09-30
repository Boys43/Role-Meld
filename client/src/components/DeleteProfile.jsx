import React, { useState } from 'react'
import { Eye, EyeOff, AlertTriangle, Trash2, X } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const DeleteProfile = ({ setActiveTab }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [deleteUserLoading, setDeleteUserLoading] = useState(false)

    // Mock data - replace with your actual context
    const { backendUrl, userData, setUserData } = useContext(AppContext)

    const deleteProfile = async (e) => {
        e.preventDefault()
        setDeleteUserLoading(true)

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/delete-account`, {
                email: userData.email,
                password
            });
            if (data.success) {
                navigate('/');
                setUserData(null);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleteUserLoading(false);
        }
    }

    return (
        <div  className='fixed top-0 left-0 w-full h-screen bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50 p-4'>
            <div data-aos="fade-up" className='bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden'>
                {/* Header */}
                <div className='bg-red-50 border-b-2 border-red-200 p-6 relative'>
                    <button
                        onClick={() => setActiveTab('/userdashboard')}
                        className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors'
                        type='button'
                    >
                        <X className='w-5 h-5' />
                    </button>

                    <div className='flex items-center gap-3'>
                        <div className='p-3 bg-red-100 rounded-full'>
                            <AlertTriangle className='w-8 h-8 text-red-600' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800'>Delete Account</h1>
                            <p className='text-sm text-gray-600 mt-1'>This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className='p-6'>

                    <div className='bg-gray-50 rounded-lg p-3 mb-4 flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Account:</span>
                        <span className='text-sm font-semibold text-gray-800'>{userData.email}</span>
                    </div>

                    <div className='space-y-2 mb-6'>
                        <label className='text-sm font-medium text-gray-700 block'>
                            Confirm your password to continue
                        </label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-1 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-gray-400 transition-all border-2 border-gray-300 rounded-lg"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                            >
                                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        <button
                            onClick={() => setActiveTab('/userdashboard')}
                            type='button'
                            className='flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 border border-gray-300'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={deleteProfile}
                            disabled={deleteUserLoading || !password}
                            className='flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {deleteUserLoading ? (
                                <>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className='w-5 h-5' />
                                    <span>Delete Account</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteProfile