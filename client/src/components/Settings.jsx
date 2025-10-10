import axios from 'axios';
import { Loader2, Settings2 } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import SearchSelect from './SelectSearch';

function Settings() {
    const { backendUrl, userData, setUserData } = useContext(AppContext);
    const [checked, setChecked] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const handleVisibilityChange = async (status) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/change-visibility`, {
                email: userData.email,
                status: status
            })
            if (data.success) {
                setChecked(status)
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const [currency, setCurrency] = useState(userData.currency);
    // ---------- Update Profile ----------
    const updateProfile = async (currency) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, {
                updateUser: { currency: currency },
            });
            if (data.success) {
                setUserData(data.profile);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const currencyOptions = [
        { code: "USD", name: "United States Dollar" },
        { code: "AED", name: "United Arab Emirates Dirham" },
        { code: "PKR", name: "Pakistani Rupee" },
        { code: "OMR", name: "Omani Rial" },
        { code: "QAR", name: "Qatari Riyal" },
        { code: "SAR", name: "Saudi Riyal" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "AUD", name: "Australian Dollar" },
        { code: "CAD", name: "Canadian Dollar" },
        { code: "INR", name: "Indian Rupee" },
        { code: "BDT", name: "Bangladeshi Taka" },
        { code: "MYR", name: "Malaysian Ringgit" },
        { code: "THB", name: "Thai Baht" },
        { code: "CNY", name: "Chinese Yuan" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "ZAR", name: "South African Rand" },
    ];

    return (
        <div className='w-full min-h-screen overflow-y-auto p-8'>
            <h1 className='flex items-center gap-2 text-2xl font-bold'>
                <Settings2 className='text-[var(--primary-color)]' />
                Settings
            </h1>
            <div className='mt-8  w-full'>
                <div className='flex justify-between'>
                    <span className='text-lg font-semibold'>
                        Change Your Account Visibility
                    </span>
                    <label className="inline-flex items-center cursor-pointer gap-4">
                        {loading ? <Loader2 className="animate-spin" /> : <span className="ms-3 text-sm font-medium">{checked ? 'Active' : 'Inactive'}</span>}
                        <input
                            type="checkbox"
                            name="toggleMe"
                            checked={checked}
                            onChange={(e) => handleVisibilityChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <div className='w-full mt-8'>
                    <SearchSelect
                        label="Currency"
                        labelStyle="text-lg font-semibold"
                        // icon={FaMoneyBillWave}
                        className="flex w-full justify-between"
                        options={currencyOptions}
                        value={currency}
                        onChange={(e) => { updateProfile(e.target.value); setCurrency(e.target.value) }}
                        placeholder="e.g. USD"
                    />

                </div>
            </div>
        </div>
    )
}

export default Settings