import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { FaCamera, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiSkills } from "react-icons/gi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";
import { toast } from 'react-toastify';
import axios from 'axios';

const Resume = () => {
    const { userData, backendUrl, setUserData } = useContext(AppContext);
    const [updatePopUpState, setUpdatePopUpState] = useState('hidden');
    const [formData, setFormData] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");

        if (keys.length === 2) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...(prev[keys[0]] || {}),   // ✅ ensure object exists
                    [keys[1]]: value
                }
            }));
        } else if (keys.length === 3) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...(prev[keys[0]] || {}),   // ✅ ensure resume exists
                    [keys[1]]: {
                        ...(prev[keys[0]]?.[keys[1]] || {}), // ✅ ensure education exists
                        [keys[2]]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    console.log(formData);
    console.log('userData', userData);
    
    const updateProfile = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, { updateUser: formData })
            if (data.success) {
                setUserData(data.user)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className='p-10'>
                <h1>Update Your Resume</h1>
                <div className="p-2 mt-5">
                    <h2 className='text-[var(--secondary-color)] font-semibold'>{userData.name}</h2>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col gap-2">

                            <div className="flex items-center gap-4"><FaLocationDot className="text-[var(--primary-color)]" />{userData.location?.city}, {userData.location?.address}, {userData.location?.postal}</div>
                            <div className="flex items-center gap-4"><FaPhone className="text-[var(--primary-color)]" />{userData?.phone ? userData.phone : '-'}</div>
                            <div className="flex items-center gap-4">
                                <GiSkills className="text-[var(--primary-color)]" />
                                {userData?.resume?.skills && userData?.resume?.skills.length > 0 ? (
                                    <div className="flex gap-2">
                                        {userData?.resume?.skills.map((skill, index) => (
                                            <span key={index} className="px-2 text-[0.8rem] border rounded-2xl bg-[var(--primary-color)] text-white">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    "-"
                                )}
                            </div>
                        </div>
                        <div className="h-full flex items-center w-full justify-center"><HiOutlinePencilSquare className="cursor-pointer text-[var(--primary-color)]" onClick={() => setUpdatePopUpState('block')} /></div>
                    </div>
                </div>
                <hr className='mt-5' />
                <form onSubmit={updateProfile} className='flex flex-col gap-3 mt-5 max-w-1/2'>
                    <h2 className='text-[var(--primary-color)] font-semibold'>Education</h2>

                    <label htmlFor="resume.education.college" className="font-medium">College/University</label>
                    <input type="text"
                        name="resume.education.college"
                        value={formData?.resume?.education?.college || userData?.resume?.education?.college} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.resume?.education?.college ? userData?.resume?.education?.college : 'Not Set'} />

                    <label htmlFor="resume.education.city" className="font-medium">City</label>
                    <input type="text"
                        name="resume.education.city"
                        value={formData?.resume?.education?.city || userData?.resume?.education?.city} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.resume?.education?.city ? userData?.resume?.education?.city : 'Not Set'} />

                    <label htmlFor="resume.education.qualification" className="font-medium">Qualification</label>
                    <div className='flex items-center gap-2'>
                        <input type="text"
                            name="resume.education.qualification"
                            value={formData?.resume?.education?.qualification || userData?.resume?.education?.qualification} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.resume?.education?.qualification ? userData?.resume?.education?.qualification : 'Not Set'} />
                        <div>
                            <label htmlFor="resume.education.from" className="font-medium">From: </label>
                            <select name="resume.education.from" id="from" onChange={handleChange}>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                                <option value="2017">2017</option>
                                <option value="2016">2016</option>
                                <option value="2015">2015</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="resume.education.to" className="font-medium">To: </label>
                            <select name="resume.education.to" id="to" onChange={handleChange}>
                                <option value="present">Present</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                                <option value="2017">2017</option>
                                <option value="2016">2016</option>
                                <option value="2015">2015</option>
                            </select>
                        </div>
                    </div>
                    <button type='submit' className="mt-4 p-2 bg-[var(--primary-color)] text-white rounded">Update</button>
                </form>
            </div>

            <div className={`w-full backdrop-blur-sm flex items-center justify-center rounded h-screen border fixed top-[50%] left-[50%] translate-[-50%] ${updatePopUpState}`}>
                <div className=" w-[70%] h-[70%] border relative bg-white shadow-2xl rounded-2xl overflow-y-auto p-4 ">

                    <MdCancel onClick={() => setUpdatePopUpState('hidden')} size={20} className="absolute right-5 top-5 cursor-pointer" />

                    <h1 className="text-[var(--primary-color)] font-semibold">Update Your Profile</h1>

                    {/* Update Profile Pop Up */}
                    <form onSubmit={updateProfile} className="flex flex-col gap-1 mt-3">
                        <label htmlFor="name" className="font-medium">Name</label>
                        <input type="text"
                            name="name"
                            value={formData?.name || userData?.name} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.name ? userData?.name : ''} />

                        <label htmlFor="phone" className="font-medium mt-2">Phone</label>
                        <input type="tel"
                            name="phone"
                            value={formData?.phone || userData?.phone} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.phone ? userData?.phone : 'Not Set'} />

                        <label htmlFor="headline" className="font-medium mt-2">HeadLine</label>
                        <input type="tel"
                            name="headline"
                            value={formData?.headline || userData?.headline} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.headline ? userData?.headline : 'Not Set'} />

                        <hr className="mt-5" />
                        <h2 className="text-[var(--primary-color)]">Location </h2>

                        <label htmlFor="location.address" className="font-medium mt-2">Address</label>
                        <input type="text"
                            name="location.address"
                            value={formData?.location?.address || userData?.location?.address} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.location?.address ? userData?.location?.address : 'Not Set'} />

                        <label htmlFor="location.city" className="font-medium mt-2">City</label>
                        <input type="text"
                            name="location.city"
                            value={formData?.location?.city || userData?.location?.city} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.location?.city ? userData?.location?.city : 'Not Set'} />

                        <label htmlFor="location.postal" className="font-medium mt-2">Postal Code</label>
                        <input type="text"
                            name="location.postal"
                            value={formData?.location?.postal || userData?.location?.postal} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.location?.postal ? userData?.location?.postal : 'Not Set'} />

                        <hr className="mt-5" />
                        <h2 className="text-[var(--primary-color)]">Work </h2>
                        <div className="flex flex-wrap gap-2">
                            {userData?.resume?.skills?.length > 0 &&
                                userData.resume.skills.map((e, i) => (
                                    <span
                                        onClick={() => {
                                            const currentSkills = formData?.resume?.skills || userData?.resume?.skills || [];
                                            const updatedSkills = currentSkills.filter(skill => skill !== e);
                                            setFormData(prev => ({
                                                ...prev,
                                                resume: {
                                                    ...prev.resume,
                                                    skills: updatedSkills
                                                }
                                            }))
                                        }}
                                        key={i}
                                        className="bg-[var(--primary-color)] text-white text-[0.8rem] flex items-center rounded-2xl px-2"
                                    >
                                        {e}
                                    </span>
                                ))
                            }
                        </div>

                        <label htmlFor="resume.skills" className="font-medium mt-2">Skills</label>
                        <input
                            type="text"
                            name="resume.skills"
                            value={
                                formData?.resume?.skills
                                    ? formData.resume.skills.join(", ")
                                    : userData?.resume?.skills?.join(", ") || ""
                            }
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    resume: {
                                        ...prev.resume,
                                        skills: e.target.value.split(",").map(skill => skill.trim())
                                    }
                                }))
                            }
                            className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded"
                            placeholder={userData?.resume?.skills?.length > 0 ? 'Add More' : 'Not Set'}
                        />
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Resume
