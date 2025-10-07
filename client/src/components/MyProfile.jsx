import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FaCamera } from 'react-icons/fa';
import { User, Phone, Link, MapPin, Briefcase, Save } from 'lucide-react'
import LocationSelector from './LocationSelector';

const MyProfile = () => {
    const { userData, backendUrl, setUserData, profileScore } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: userData.name || "",
        phone: userData.phone || "",
        headline: userData.headline || "",
        portfolio: userData.portfolio || "",
        address: userData.address || "",
        city: userData.city || "",
        postal: userData.postal || "",
        country: userData.country || "",
        skills: userData.skills || [],
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
        if (!formData?.portfolio?.includes("http") && formData?.portfolio) {
         return toast.error("Please add a vlaid portfolio link")   
        }
        if (!formData?.name) {
            return toast.error("Name is Required")
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
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={userData?.phone || "e.g, +92 123 456789"}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                            />
                        </div>

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

                        <div className='space-y-2'>
                            <label className="flex items-center gap-2 font-medium text-gray-700">
                                <Link className='w-4 h-4 text-gray-500' />
                                Portfolio
                            </label>
                            <input
                                type="text"
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleChange}
                                placeholder={userData?.portfolio || "e.g, https://github.com/username"}
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

                            <div className='flex items-center'>
                                {/* <div className='space-y-2'>
                                    <label className="font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        placeholder={userData?.city || "e.g, Lahore"}
                                        onChange={handleChange}
                                        className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                                    />
                                </div> */}

                                <LocationSelector
                                    selectedCountry={formData.country}
                                    selectedCity={formData.city}
                                    onCountryChange={(country) => setFormData(prev => ({ ...prev, country }))}
                                    onCityChange={(city) => setFormData(prev => ({ ...prev, city }))}
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

                        <hr className="mt-2" />
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                            <Briefcase className='w-5 h-5' />
                            Work
                        </h2>

                        <div className="space-y-3">
                            {/* Label */}
                            <label className="font-semibold text-gray-800 text-sm">Skills</label>

                            {/* Skills List */}
                            <div className="flex flex-wrap gap-2">
                                {formData?.skills?.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-2 animate-fadeIn"
                                    >
                                        {skill}
                                        <span
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    skills: prev.skills.filter((_, i) => i !== index),
                                                }))
                                            }
                                            className="hover:text-red-500 text-gray-500 transition-colors cursor-pointer"
                                        >
                                            ✕
                                        </span>
                                    </span>
                                ))}
                            </div>

                            {/* Input */}
                            <input
                                type="text"
                                name="skills"
                                onKeyDown={(e) => {
                                    if (e.key === 'Tab' || e.key === 'Enter') {
                                        e.preventDefault();
                                        if (formData?.skills?.includes(e.target.value)) return toast.error('Skill already exists')
                                        
                                        setFormData((prev) => ({
                                            ...prev,
                                            skills: [...prev.skills, e.target.value.trim()],
                                        }));
                                    }
                                }}
                                placeholder="e.g., Web Development, Graphic Design"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />

                            {/* Hint */}
                            <p className="text-xs text-gray-500">Press <b>Enter</b> to add each skill</p>
                        </div>

                    </div>

                    <div className='flex flex-col gap-6'>
                        <div className='bg-white shadow-lg rounded-xl border border-gray-200 p-6 flex flex-col items-center'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4 self-start'>Profile Picture</h3>

                            <div className='relative w-36 h-36 mb-4'>
                                <div className="relative w-36 h-36">
                                    <CircularProgressbar
                                        value={profileScore}
                                        text={""}
                                        styles={{
                                            path: {
                                                stroke:
                                                    profileScore <= 25
                                                        ? "#ef4444"
                                                        : profileScore <= 50
                                                            ? "#f97316"
                                                            : profileScore <= 75
                                                                ? "#facc15"
                                                                : "#22c55e",
                                                strokeLinecap: "round",
                                                transition: "stroke-dashoffset 0.5s ease",
                                            },
                                            trail: { stroke: "#f3f4f6" },
                                        }}
                                    />

                                    {userData?.profilePicture ? (
                                        <img
                                            loading="lazy"
                                            src={`${backendUrl}/uploads/${userData.profilePicture}`}
                                            alt="Profile"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full object-cover z-10 shadow-xl"
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
                                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 rounded-full p-2.5 cursor-pointer shadow-lg transition-colors"
                                >
                                    <FaCamera className="text-white text-base" />
                                </label>
                            </div>

                            <div className={`p-4 shadow-md bg-gradient-to-br ${profileScore <= 25 ? 'from-red-50 to-red-100 border-red-300' :
                                profileScore <= 50 ? 'from-orange-50 to-orange-100 border-orange-300' :
                                    profileScore <= 75 ? 'from-yellow-50 to-yellow-100 border-yellow-300' :
                                        'from-green-50 to-green-100 border-green-300'
                                } rounded-lg border-2 w-full text-center text-gray-700`}>
                                {profileScore === 100 && (
                                    <span className='font-semibold mr-1 block mb-1'>
                                        🎉 Congratulations!
                                    </span>
                                )}
                                <p>Profile Completion: <span className={`font-bold text-xl ${profileScore <= 25 ? 'text-red-500' :
                                    profileScore <= 50 ? 'text-orange-500' :
                                        profileScore <= 75 ? 'text-yellow-600' :
                                            'text-green-500'
                                    }`}>{profileScore}%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile
