import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, Briefcase, Save, Building, FileText, Camera, Clock, Upload, X, Image } from 'lucide-react'
import Img from './Image';
import LocationSelector from './LocationSelector';
import SearchSelect from './SelectSearch';
import { CircularProgressbar } from 'react-circular-progressbar';
import { MdWarning } from 'react-icons/md';
import CustomSelect from './CustomSelect';

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

    const [companyImages, setCompanyImages] = useState(userData?.companyImages || []);
    const [uploadingImages, setUploadingImages] = useState(false);


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

        if (!formData.company) {
            return toast.error("Company Name is required")
        }

        if (formData?.website && !formData.website.includes("http")) {
            return toast.error("Enter a Valid Website Url")
        }

        if (formData?.about?.split(" ").length > 150) {
            return toast.error("About is required and should be between 50 and 150 words")
        }

        if (!formData.contactNumber && userData?.reviewStatus === "approved") {
            return toast.error("Contact Number is required")
        }

        if (!formData.tagline && userData?.reviewStatus === "approved") {
            return toast.error("Tagline is required")
        }

        if (!formData.city && userData?.reviewStatus === "approved") {
            return toast.error("City is required")
        }

        if (!formData.country && userData?.reviewStatus === "approved") {
            return toast.error("Country is required")
        }

        if (!formData.companyType && userData?.reviewStatus === "approved") {
            return toast.error("Company Type is required")
        }

        if (!formData.industry && userData?.reviewStatus === "approved") {
            return toast.error("Industry is required")
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

    // ---------- Company Images Upload ----------
    const uploadCompanyImages = async (files) => {
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const formData = new FormData();
        
        Array.from(files).forEach(file => {
            formData.append('companyImages', file);
        });

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/upload-company-images`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (data.success) {
                setCompanyImages(data.images);
                setUserData(prev => ({ ...prev, companyImages: data.images }));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload images");
        } finally {
            setUploadingImages(false);
        }
    };

    // ---------- Delete Company Image ----------
    const deleteCompanyImage = async (imageUrl) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/delete-company-image`,
                { imageUrl }
            );

            if (data.success) {
                setCompanyImages(data.images);
                setUserData(prev => ({ ...prev, companyImages: data.images }));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete image");
        }
    };

    const industryOptions = [
        { name: "1", code: "Electronics / Electrical" },
        { name: "2", code: "Engineering (Civil / Mechanical / Electrical)" },
        { name: "3", code: "Food & Beverages / Hospitality" },
        { name: "4", code: "Government / Public Sector" },
        { name: "5", code: "Healthcare / Medical" },
        { name: "6", code: "Human Resources (HR)" },
        { name: "7", code: "Information Technology / Software" },
        { name: "8", code: "Legal / Law" },
        { name: "9", code: "Logistics / Supply Chain" },
        { name: "10", code: "Manufacturing" },
        { name: "11", code: "Media / Journalism" },
        { name: "12", code: "NGO / Social Services" },
        { name: "13", code: "Operations / Management" },
        { name: "14", code: "Real Estate" },
        { name: "15", code: "Retail / Sales" },
        { name: "16", code: "Security / Safety" },
        { name: "17", code: "Telecommunications" },
        { name: "18", code: "Tourism / Travel" },
        { name: "19", code: "Transportation / Drivers" }
    ];


    return (
        <div className='w-full min-h-screen overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-6'>
                    <h1 className="text-3xl font-bold text-gray-800">Update Your Profile</h1>
                    <span className='text-sm text-gray-600 mt-1'>Keep your information up to date</span>
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
                        <hr />

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
                                <SearchSelect
                                    label="Industry"
                                    labelStyle=""
                                    className=""
                                    options={industryOptions}
                                    value={formData?.industry}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            industry: e.target.value,
                                        }));
                                    }}
                                    placeholder="e.g. Software Development"
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
                            <CustomSelect
                                name="companyType"
                                value={formData.companyType || ""}
                                onChange={handleChange}
                            >
                                <option value="">---Choose your Company Type ---</option>
                                <option value="Private Limited Company">Private Limited Company</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Government Organization">Government Organization</option>
                                <option value="Non-Profit Organization">Non-Profit Organization</option>
                                <option value="Startup">Startup</option>
                                <option value="Educational Institute">Educational Institute</option>
                                <option value="Consultancy / Agency">Consultancy / Agency</option>
                            </CustomSelect>
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
                                    className="mt-2 w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
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
                                        className="mt-2 w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
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
                                className="mt-2 text-sm w-full p-3 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg transition-colors min-h-[120px] resize-none"
                            />
                            <div className={`text-right ${(formData?.about.split(' ').length > 150) ? "text-red-500" : "text-green-500"} `}>
                                {formData?.about.split(' ').length} / 150
                            </div>
                        </div>

                        <hr className="mt-2" />

                        <h2 className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                            <Image className="w-5 h-5" />
                            Company Images
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 text-sm">Upload images to showcase your company</p>
                                <input
                                    type="file"
                                    id="companyImages"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => uploadCompanyImages(e.target.files)}
                                />
                                <label
                                    htmlFor="companyImages"
                                    className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                                </label>
                            </div>

                            {companyImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {companyImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image}
                                                alt={`Company ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={() => deleteCompanyImage(image)}
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {companyImages.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">No company images uploaded yet</p>
                                    <p className="text-gray-400 text-sm">Upload images to showcase your company</p>
                                </div>
                            )}
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
                                        <Img
                                            src={userData.profilePicture}
                                            style="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full object-cover z-10 shadow-xl"
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
                            <span className="flex items-center gap-3 my-2 text-sm text-gray-500 font-medium">
                                You are at <b>{userData?.profileScore}%</b>
                            </span>

                            {userData?.profileScore < 100 && userData?.reviewStatus !== "approved" ? <span className="p-3 rounded-lg shadow-md text-sm flex flex-col items-center text-center gap-2 border border-yellow-300 bg-yellow-50/80 text-yellow-700 font-medium">
                                <MdWarning className="text-yellow-500 animate-pulse" size={25} />
                                <span>Your account is <b>not yet active</b>.</span>
                                <span className="text-gray-600 text-xs">Please complete your profile to activate it.</span>
                            </span>
                                :
                                <>
                                    <div className='w-full p-3 bg-gradient-to-br from-green-200 to-green-300 rounded-lg shadow-md text-lg flex flex-col items-center text-center gap-2 border border-green-300 font-medium xt-lg '>
                                        🎉 Congratulations!
                                    </div>
                                    {userData?.reviewStatus !== "approved" &&
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