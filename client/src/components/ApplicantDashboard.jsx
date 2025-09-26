import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { FaCamera, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const ApplicantDashboard = () => {
  const { userData, setUserData, backendUrl, profileScore } = useContext(AppContext);
  const [profilePicture, setProfilePicture] = useState('')
  const [showSubmit, setShowSubmit] = useState(false);
  const [updatePopUpState, setUpdatePopUpState] = useState('hidden');
  const [resume, setResume] = useState('');

  // Navigate
  const navigate = useNavigate()

  const changePicture = async (e) => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/updateprofilepicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

  const changeResume = async (e) => {
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/updateresume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setUserData(data.profile);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  const [formData, setFormData] = useState({})

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };


  const updateProfile = async (updatedSkills) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, { updateUser: formData })
      if (data.success) {
        setUserData(data.profile)
        toast.success(data.message)
        setFormData({})
        setUpdatePopUpState('hidden')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="p-5 w-full h-[calc(100vh-4.6rem)] overflow-y-scroll">
        <div className="p-4 flex gap-4 items-center border-b-1">
          <div className="relative w-20 h-20">
            {/* Profile Circle */}
            <div className="w-20 h-20 border-2 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-xl font-semibold">
              {userData?.profilePicture ? (
                <img
                  src={`${backendUrl}/uploads/${userData.profilePicture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                userData?.name?.[0] || "?"
              )}
            </div>

            {/* Upload Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changePicture();
                setShowSubmit(false); // hide button again after upload
              }}
              className="mt-2"
            >
              {/* Hidden File Input */}
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                className="hidden"
                onChange={(e) => {
                  setProfilePicture(e.target.files[0]);
                  setShowSubmit(true); // show button after file chosen
                }}
              />

              {/* Camera Icon as Label */}
              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
              >
                <FaCamera className="text-gray-600 text-sm" />
              </label>

              {/* Show Submit Button only after file chosen */}
              {showSubmit && (
                <button
                  type="submit"
                >
                  Upload
                </button>
              )}
            </form>
          </div>
          <div className="p-4">
            <h1 className="font-bold">Hi, {userData?.name}</h1>
            <p>{userData?.email}</p>
          </div>
        </div>

        {/* User Data */}
        <div className="p-2 mt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">

              <div className="flex items-center gap-4"><FaLocationDot className="text-[var(--primary-color)]" />{userData?.city}, {userData?.address}, {userData?.postal}</div>
              <div className="flex items-center gap-4"><FaPhone className="text-[var(--primary-color)]" />{userData?.phone ? userData.phone : '-'}</div>
              <div className="flex items-center gap-4">
                {userData?.email}
              </div>
            </div>
            <div className="h-full flex items-center w-full justify-center"><HiOutlinePencilSquare className="cursor-pointer text-[var(--primary-color)]" onClick={() => setUpdatePopUpState('block')} /></div>
          </div>
        </div>


        <hr className="mt-5" />
        <h2 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">📄 Resume</h2>

        {userData?.resume ? (
          <div className="space-y-4">
            {/* Uploaded Resume Display */}
            <div className="flex items-center justify-between bg-white shadow-md rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Uploaded File:</span>
                <strong className="text-[var(--primary-color)]">{userData.resume}</strong>
              </div>
            </div>

            {/* Update Resume Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changeResume();
              }}
              className="flex items-center gap-3 bg-[var(--primary-color)]/10 p-3 rounded-xl border-2 border-[var(--primary-color)]"
            >
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-700 
                   file:mr-4 file:py-2 file:px-4 
                   file:rounded-lg file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-[var(--primary-color)]/80 file:text-white 
                   hover:file:bg-[var(--primary-color)]/100 
                   cursor-pointer"
                onChange={(e) => setResume(e.target.files[0])}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white font-medium hover:bg-[var(--primary-color)]/90 transition"
              >
                Update
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Upload Resume</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changeResume();
              }}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-300"
            >
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-700 
                   file:mr-4 file:py-2 file:px-4 
                   file:rounded-lg file:border-0 
                   file:text-sm file:font-semibold 
                   file:bg-[var(--primary-color)]/80 file:text-white 
                   hover:file:bg-[var(--primary-color)]/100 
                   cursor-pointer"
                onChange={(e) => setResume(e.target.files[0])}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white font-medium hover:bg-[var(--primary-color)]/90 transition"
              >
                Upload
              </button>
            </form>
          </div>
        )}


        <hr className="mt-5" />

        {/* Profile Score */}
        <div className="p-4 bg-white rounded-lg shadow-md border">
          <h2 className="text-lg font-semibold text-gray-800">Your Profile Score</h2>
          <h3 className="text-2xl font-bold text-[var(--primary-color)] mt-1">{profileScore}%</h3>

          {/* Progress Bar */}
          <div className="w-full mt-3 bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full ${profileScore <= 25
                ? "bg-red-500"
                : profileScore <= 50
                  ? "bg-orange-500"
                  : profileScore <= 75
                    ? "bg-yellow-400"
                    : "bg-green-500"} bg-green-500 transition-all duration-500`}
              style={{ width: `${profileScore}%` }}
            ></div>
          </div>

          {/* Improvement Section */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Improve Your Profile Score</h3>
            <div className="mt-2 p-3 border rounded-md text-sm text-gray-600">
              Add missing details like skills, experience, or profile picture to boost your score.
            </div>
          </div>
        </div>


        {/* Update Profile Pop Up */}
        <div className={`w-full backdrop-blur-sm flex items-center justify-center rounded h-screen border fixed z-51 top-[50%] left-[50%] translate-[-50%] ${updatePopUpState}`}>
          <div className=" w-[70%] h-[70%] border relative bg-white shadow-2xl rounded-2xl overflow-y-auto p-4 ">

            <MdCancel onClick={() => setUpdatePopUpState('hidden')} size={20} className="absolute right-5 top-5 cursor-pointer" />

            <h1 className="text-[var(--primary-color)] font-semibold">Update Your Profile</h1>

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
              <input type="text"
                name="headline"
                value={formData?.headline || userData?.headline} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.headline ? userData?.headline : 'Not Set'} />

              <label htmlFor="resume" className="font-medium mt-2">Portfolio</label>
              <input
                type="text"
                name="portfolio"
                value={formData?.portfolio || userData?.portfolio}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded"
                placeholder={userData?.portfolio ? userData?.portfolio : 'Add Portfolio link'}
              />

              <hr className="mt-5" />
              <h2 className="text-[var(--primary-color)]">Location </h2>

              <label htmlFor="address" className="font-medium mt-2">Address</label>
              <input type="text"
                name="address"
                value={formData?.address || userData?.address} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.address ? userData?.address : 'Not Set'} />

              <label htmlFor="city" className="font-medium mt-2">City</label>
              <input type="text"
                name="city"
                value={formData?.city || userData?.city} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.city ? userData?.city : 'Not Set'} />

              <label htmlFor="postal" className="font-medium mt-2">Postal Code</label>
              <input type="text"
                name="postal"
                value={formData?.postal || userData?.postal} onChange={handleChange} className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded" placeholder={userData?.postal ? userData?.postal : 'Not Set'} />

              <hr className="mt-5" />
              <h2 className="text-[var(--primary-color)]">Work </h2>
              <div className="flex flex-wrap gap-2">
                {userData?.skills?.length > 0 &&
                  userData.skills.map((skill, i) => (
                    <span
                      onClick={() => {
                        const currentSkills = formData?.skills || userData?.skills || [];
                        const updatedSkills = currentSkills.filter(s => s !== skill);
                        setFormData(prev => ({
                          ...prev,
                          skills: updatedSkills
                        }));
                      }}
                      key={i}
                      className="bg-[var(--primary-color)] text-white text-[0.8rem] flex items-center rounded-2xl px-2 cursor-pointer"
                    >
                      {skill}
                    </span>
                  ))
                }

              </div>

              <label htmlFor="skills" className="font-medium mt-2">Skills</label>
              <input
                type="text"
                name="skills"
                value={formData?.skills ? formData.skills.join(", ") : userData?.skills?.join(", ") || ""}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    skills: e.target.value.split(",").map(skill => skill.trim())
                  }))
                }
                className="p-2 border-2 focus:border-[var(--primary-color)] focus:outline-0 transition-all focus:shadow-lg shadow-sm rounded"
                placeholder={userData?.skills?.length > 0 ? 'Add More' : 'Not Set'}
              />
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>

    </>
  );
};

export default ApplicantDashboard;