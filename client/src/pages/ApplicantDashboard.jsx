import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { FaCamera, FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiSkills } from "react-icons/gi";
import { IoDocument } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const ApplicantDashboard = () => {
  const { userData, setUserData, backendUrl, profileScore } = useContext(AppContext);
  const [profilePicture, setProfilePicture] = useState('')
  const [showSubmit, setShowSubmit] = useState(false);
  const [updatePopUpState, setUpdatePopUpState] = useState('hidden');

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


  const [formData, setFormData] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

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
      <div className="p-10 w-[60%] mx-auto h-auto">
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
            <h1 className="font-bold">Hi, {userData.name}</h1>
            <p>{userData?.email}</p>
          </div>
        </div>

        {/* User Data */}
        <div className="p-2 mt-5">
          <div className="grid grid-cols-2 gap-4">
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

        <hr className="mt-5" />

        {/* User Resume */}
        <div className="px-6 py-2 max-w-sm mt-5 border-[var(--primary-color)] border rounded-2xl flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <IoDocument className="text-[var(--primary-color)]" size={40} />
            <div>
              <p>Role Meld Resume</p>
              <p>Updated {userData?.resume?.lastUpdate ? userData?.resume?.lastUpdate : '-'}</p>
            </div>
          </div>
          <HiOutlinePencilSquare onClick={() => navigate('/resume')} className="text-[var(--primary-color)] cursor-pointer" />
        </div>

        <hr className="mt-5" />

        {/* Profile Score */}
        <div className="p-2">
          <h2>Your Profile Score</h2>
          <h3>{profileScore}</h3>
          <div className="w-full mt-2 border h-4 rounded">
            <div
              className="h-full bg-green-500"
              style={{ width: `${profileScore}%` }}
            ></div>
            <div>
            </div>
            <div>
              <h3>Improve Your Profile Score: </h3>
              <div className="p-4 border"></div>
            </div>
          </div>
        </div>

        {/* Update Profile Pop Up */}
        <div className={`w-full backdrop-blur-sm flex items-center justify-center rounded h-screen border fixed top-[50%] left-[50%] translate-[-50%] ${updatePopUpState}`}>
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
      </div>
    </>
  );
};

export default ApplicantDashboard;