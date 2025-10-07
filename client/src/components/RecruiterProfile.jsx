import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Briefcase, Save, Building, FileText, Camera } from 'lucide-react'
import Img from './Image';
import LocationSelector from './LocationSelector';

const RecruiterProfile = () => {
    const { userData, backendUrl, setUserData } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: userData?.name || "",
        headline: userData?.headline || "",
        company: userData?.company || "Individual",
        members: userData?.members || 1,
        website: userData?.website || "",
        city: userData?.city || "",
        country: userData?.country || "",
        establishedDate: userData?.establishedDate || "",
        state: userData?.state || "",
        contactNumber: userData?.contactNumber || "",
        about: userData?.about || "",
        industry: userData?.industry || "",
        postal: userData?.postal || "",
        address: userData?.address || "",
        isPhysical: userData?.isPhysical || false,
    });


    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    // ---------- Update Profile ----------
    const updateProfile = async (e) => {
        if (!formData.name) {
            return toast.error("Name is required")
        }
        if (!formData.website.includes("http")) {
            return toast.error("Enter a Valid Website Url")
        }
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, {
                updateUser: formData,
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

    // Profile Picture
    const changePicture = async (profilePicture) => {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/updateprofilepicture`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (data.success) {
                setUserData(data.user);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className='w-full h-[calc(100vh-4.6rem)] overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-6'>
                    <h1 className="text-3xl font-bold text-gray-800">Update Your Profile</h1>
                    <p className='text-sm text-gray-600 mt-1'>Keep your information up to date</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white shadow-lg rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
                        <div className='flex items-center justify-between pb-4 border-b-2 border-gray-100'>
                            <h2 className='text-xl font-semibold text-gray-800'>Personal Information</h2>
                            <button
                                onClick={updateProfile}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                                <Save className='w-4 h-4' />
                                Save
                            </button>
                        </div>

                        <div className='space-y-2'>
                            <label className="flex items-center gap-2 font-medium text-gray-700">
                                <User className='w-4 h-4 text-gray-500' />
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={userData?.name || "Name"}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className="flex items-center gap-2 font-medium text-gray-700">
                                <Phone className='w-4 h-4 text-gray-500' />
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder={userData?.contactNumber || "e.g, +92 123 456789"}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                            />
                        </div>
                        <hr />
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm w-full max-w-sm">
                            <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                                Is your business physical?
                            </span>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData?.isPhysical}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isPhysical: e.target.checked,
                                        }))
                                    }
                                />

                                <div
                                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-4 
      peer-focus:ring-blue-200 dark:peer-focus:ring-blue-800 dark:bg-gray-600 
      peer-checked:bg-blue-600 transition-colors duration-300"
                                ></div>

                                <div
                                    className="absolute left-[2px] top-[2px] bg-white h-5 w-5 rounded-full 
      border border-gray-300 dark:border-gray-500 transition-transform duration-300 
      peer-checked:translate-x-full"
                                ></div>
                            </label>
                        </div>

                        <hr />

                        <h3>What's In Your Mind</h3>
                        <div className='space-y-2'>
                            <label className="flex items-center gap-2 font-medium text-gray-700">
                                <Briefcase className='w-4 h-4 text-gray-500' />
                                Headline
                            </label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                placeholder={userData?.headline || "e.g, Web Developer"}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                            />
                        </div>

                        <hr className="mt-2" />
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                            <MapPin className='w-5 h-5' />
                            Location
                        </h2>

                        <div className='flex flex-col gap-4'>
                            <div className='space-y-2'>
                                <label className="font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder={userData?.address || "e.g, Block A New London"}
                                    className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                />
                            </div>

                            <LocationSelector
                                selectedCountry={formData.country}
                                selectedCity={formData.city}
                                onCountryChange={(country) => setFormData(prev => ({ ...prev, country }))}
                                onCityChange={(city) => setFormData(prev => ({ ...prev, city }))}
                            />

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <label className="font-medium text-gray-700">State/Province</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder={userData?.state || "e.g, Punjab"}
                                        className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className="font-medium text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postal"
                                        value={formData.postal}
                                        onChange={handleChange}
                                        placeholder={userData?.postal || "e.g, 12345"}
                                        className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="mt-2" />
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                            Company Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder={userData?.company || "e.g., TechVerse Solutions"}
                                    className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    placeholder={userData?.industry || "e.g., Software Development"}
                                    className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Members</label>
                                <input
                                    type="number"
                                    name="members"
                                    value={formData.members}
                                    onChange={handleChange}
                                    placeholder={userData?.members || "e.g., 10"}
                                    className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder={userData?.website || "e.g., https://www.company.com"}
                                    className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                />
                            </div>
                        </div>

                        <hr className="mt-2" />
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                            <FileText className="w-5 h-5" />
                            About
                        </h2>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700">Company / Personal Bio</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                placeholder={userData?.about || "Write a short description about yourself or your company..."}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors min-h-[120px] resize-none"
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <div className='bg-white shadow-lg rounded-xl border border-gray-200 p-6 flex flex-col items-center'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4 self-start'>Profile Picture</h3>

                            <div className='relative w-36 h-36 mb-4'>
                                <div className="relative w-36 h-36">
                                    {userData?.profilePicture ? (
                                        <Img
                                            src={`${backendUrl}/uploads/${userData.profilePicture}`}
                                            style="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full object-cover z-10 border border-gray-300 shadow-xl"
                                        />
                                    ) : (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-xl z-10">
                                            <span className="text-4xl font-bold text-blue-600">
                                                {userData?.name?.[0] || "?"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    id="profilePicture"
                                    name="profilePicture"
                                    className="hidden"
                                    onChange={(e) => changePicture(e.target.files[0])}
                                />
                                <label
                                    htmlFor="profilePicture"
                                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                                >
                                    <Camera size={20} className="text-white text-base" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecruiterProfile