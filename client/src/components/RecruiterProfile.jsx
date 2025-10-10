import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Briefcase, Save, Building, FileText, Camera, Clock } from 'lucide-react'
import Img from './Image';
import LocationSelector from './LocationSelector';
import SearchSelect from './SelectSearch';
import { CircularProgressbar } from 'react-circular-progressbar';
import { MdWarning } from 'react-icons/md';

const RecruiterProfile = () => {
    const { userData, backendUrl, setUserData } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: userData?.name || "",
        tagline: userData?.tagline || "",
        company: userData?.company || "",
        website: userData?.website || "",
        city: userData?.city || "",
        country: userData?.country || "",
        establishedDate: userData?.establishedDate || "",
        state: userData?.state || "",
        contactNumber: userData?.contactNumber || "",
        about: userData?.about || "",
        industry: userData?.industry || "",
        address: userData?.address || "",
        companyType: userData?.companyType || "",
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

        if (formData?.about?.split(" ").length < 50 || formData?.about?.split(" ").length > 150) {
            return toast.error("About is required and should be between 50 and 150 words")
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

    const companyTypes = [
        { code: 'private', name: "Private Limited Company" },
        { code: 'partnership', name: "Partnership" },
        { code: 'government', name: "Government Organization" },
        { code: 'non-profit', name: "Non-Profit Organization" },
        { code: 'startup', name: "Startup" },
        { code: 'education', name: "Educational Institute" },
        { code: 'agency', name: "Consultancy / Agency" }
    ];

    return (
        <div className='w-full min-h-screen overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
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

                        <h3>Add Your Tagline</h3>
                        <div className='space-y-2'>
                            <label className="flex items-center gap-2 font-medium text-gray-700">
                                <Briefcase className='w-4 h-4 text-gray-500' />
                                Tagline
                            </label>
                            <input
                                type="text"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleChange}
                                placeholder={userData?.tagline || "e.g, Your Satisfaction our priority"}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
                            />
                        </div>

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

                        <div className="space-y-2 flex  flex-col">
                            <label className="font-medium text-gray-700">Company Type</label>
                            <select
                                name="companyType"
                                value={formData.companyType || ""}
                                onChange={handleChange}
                                className="py-2 px-3 mb-8 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">---Choose your Company Type ---</option>
                                <option value="Private Limited Company">Private Limited Company</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Government Organization">Government Organization</option>
                                <option value="Non-Profit Organization">Non-Profit Organization</option>
                                <option value="Startup">Startup</option>
                                <option value="Educational Institute">Educational Institute</option>
                                <option value="Consultancy / Agency">Consultancy / Agency</option>
                            </select>
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
                            <FileText className="w-5 h-5" />
                            About
                        </h2>

                        <div className="space-y-2">
                            <label className="font-medium text-gray-700">Company / Personal Bio</label>
                            <textarea
                                name="about"
                                value={formData?.about}
                                onChange={handleChange}
                                placeholder={userData?.about || "Write a short description about yourself or your company..."}
                                className="w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors min-h-[120px] resize-none"
                            />
                            <div className={`text-right ${(formData?.about.split(' ').length <= 50 || formData?.about.split(' ').length > 150) ? "text-red-500" : "text-green-500"} `}>
                                {formData?.about.split(' ').length} / 150
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <div className='bg-white shadow-lg rounded-xl border border-gray-200 p-6 flex flex-col items-center'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4 self-start'>Profile Picture</h3>


                            <div className='relative w-36 h-36 mb-2'>
                                <div className="relative w-36 h-36">
                                    <CircularProgressbar
                                        value={userData?.profileScore}
                                        text={""}
                                        styles={{
                                            path: {
                                                stroke:
                                                    userData?.profileScore <= 25
                                                        ? "#ef4444"
                                                        : userData?.profileScore <= 50
                                                            ? "#f97316"
                                                            : userData?.profileScore <= 75
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
                                    className="absolute z-999 bottom-1 right-1 bg-blue-600 hover:bg-blue-700 rounded-full p-2    cursor-pointer shadow-lg transition-colors"
                                >
                                    <Camera size={23} className="text-white text-base" />
                                </label>
                            </div>
                            <span className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-sm text-gray-500 font-medium">
                                You are at <b>{userData?.profileScore}%</b>
                            </span>

                            {userData?.profileScore < 100 && userData?.isProfileVerified ? <span className="p-3 rounded-lg shadow-md text-sm flex flex-col items-center text-center gap-2 border border-yellow-300 bg-yellow-50/80 text-yellow-700 font-medium">
                                <MdWarning className="text-yellow-500 animate-pulse" size={25} />
                                <span>Your account is <b>not yet active</b>.</span>
                                <span className="text-gray-600 text-xs">Please complete your profile to activate it.</span>
                            </span>
                                :
                                <>
                                    <div className='w-full p-3 bg-gradient-to-br from-green-200 to-green-300 rounded-lg shadow-md text-lg flex flex-col items-center text-center gap-2 border border-green-300 font-medium xt-lg '>
                                        🎉 Congratulations!
                                    </div>
                                    {userData?.reviewStatus !== "approved"  &&
                                    <div className="w-full p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex flex-col items-center text-center gap-2 border border-yellow-300 font-medium text-yellow-700 text-sm mt-4 shadow-sm">
                                        <Clock className="text-yellow-600 animate-pulse" size={26} />
                                        <span>Your account is <b>under review</b>.</span>
                                        <span>You will shortly receive an email regarding your approval status.</span>
                                    </div>}

                                </>
                            }

                        </div>

                        <div>
                            <iframe
                                width="100%"
                                height="350"
                                style={{ border: 0 }}
                                loading="lazy"
                                className='rounded-2xl shadow-lg'
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps?q=${encodeURIComponent(
                                    `${formData?.address} ${formData?.postal} ${formData?.city} ${formData?.country}`
                                )}&output=embed`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RecruiterProfile