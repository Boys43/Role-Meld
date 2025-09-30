import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { AppContext } from '../context/AppContext';
import { MdCancel } from 'react-icons/md';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FaCamera } from 'react-icons/fa';

const MyProfile = () => {
    const { userData, backendUrl, setUserData, profileScore } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        headline: "",
        portfolio: "",
        address: "",
        city: "",
        postal: "",
        skills: []
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
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, {
                updateUser: formData,
            });
            if (data.success) {
                setUserData(data.profile);
                toast.success(data.message);
                setUpdatePopUpState("hidden");
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
        <div className='w-full h-[calc(100vh-4.6rem)] overflow-y-auto p-6 '>
            <h1 className="font-semibold">Update Your Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 relative bg-white shadow-md rounded-md overflow-y-auto mt-8 gap-8">
                <form onSubmit={updateProfile} className="col-span-2 border border-gray-300 rounded-md p-2 flex flex-col gap-2">
                    <button
                        type="submit"
                        className="mt-4 self-end bg-[var(--primary-color)] text-white py-2 rounded hover:opacity-90 transition"
                    >
                        Save
                    </button>
                    <label className="font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={userData?.name || "Name"}
                        className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                    />

                    <label className="font-medium">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={userData?.phone || "e.g, +92 123 456789"}
                        className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                    />

                    <label className="font-medium">Headline</label>
                    <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleChange}
                        placeholder={userData?.headline || "e.g, Web Developer"}
                        className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                    />

                    <label className="font-medium">Portfolio</label>
                    <input
                        type="text"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        placeholder={userData?.portfolio || "e.g, https://github.com/username"}
                        className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                    />

                    <hr className="mt-5" />
                    <h2 className="text-[var(--primary-color)]">Location </h2>

                    <div className='flex flex-col gap-3'>
                        <label className="font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={userData?.address || "e.g, Block A New London "}
                            className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                        />

                        <div className='flex gap-3 items-center w-full justify-between'>
                            <label className="font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                placeholder={userData?.city || "e.g, Lahore"}
                                onChange={handleChange}
                                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                            />

                            <label className="font-medium">Postal Code</label>
                            <input
                                type="text"
                                name="postal"
                                value={formData.postal}
                                onChange={handleChange}
                                placeholder={userData?.postal || "e.g, 12345"}
                                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                            />
                        </div>

                    </div>
                    <hr className="mt-5" />
                    <h2 className="text-[var(--primary-color)]">Work </h2>

                    <label className="font-medium">Skills</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills.join(", ")}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                skills: e.target.value.split(",").map((s) => s.trim()),
                            }))
                        }
                        placeholder='e.g, Web Development, Graphic Design'
                        className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
                    />
                </form>
                <div className='p-2 flex flex-col items-center relative border border-gray-300 rounded-md'>
                    {/* Profile Picture with Profile Score */}
                    <div className='relative w-32 h-32 '>
                        <div className="relative w-32 h-32 mx-auto">
                            {/* Circular Progress */}
                            <CircularProgressbar
                                value={profileScore}
                                text={""} // hide default text
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
                                    trail: { stroke: "#f3f4f6" }, // lighter gray for trail
                                }}
                            />

                            {/* Profile Image or Initial */}
                            {userData?.profilePicture ? (
                                <img
                                    loading="lazy"
                                    src={`${backendUrl}/uploads/${userData.profilePicture}`}
                                    alt="Profile"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-25 h-25 rounded-full object-cover z-10 shadow-xl"
                                />
                            ) : (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-gray-700 z-10">
                                    {userData?.name?.[0] || "?"}
                                </span>
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
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
                        >
                            <FaCamera className="text-gray-600 text-sm" />
                        </label>
                    </div>
                    {/* Profile Score as Percenteag */}
                    <div className='p-3 shadow-md bg-gradient-to-br from-blue-100 to-blue-200 mt-4 rounded-lg border border-blue-500 w-full text-center text-gray-600'>
                        {profileScore === 100 &&
                            <span className='font-semibold mr-1'>
                                Congratulations!
                            </span>

                        }You are at <span className='font-bold text-blue-400'>{profileScore}%</span>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default MyProfile
