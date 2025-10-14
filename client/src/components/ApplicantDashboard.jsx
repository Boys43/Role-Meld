import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// Cirsluar Profile score
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { FileText, Image, Briefcase, Phone, Globe, MapPin, CreditCard, Star, Pencil, Camera, X, Loader, Bell } from "lucide-react";
import Img from "./Image";
import { Link } from "react-router-dom";

const getProfileRecommendations = (user) => {
  const recommendations = [];

  if (!user.resume || user.resume.trim() === "") {
    recommendations.push({
      icon: <FileText className="w-5 h-5 text-red-500" />,
      title: "Upload your resume",
      description: "Showcase your work and education history to attract employee.",
      color: "bg-red-50"
    });
  }

  if (!user.profilePicture || user.profilePicture.trim() === "") {
    recommendations.push({
      icon: <Image className="w-5 h-5 text-orange-500" />,
      title: "Add a profile picture",
      description: "Profiles with pictures are more trusted and attractive.",
      color: "bg-orange-50"
    });
  }

  if (!user.headline || user.headline.trim() === "") {
    recommendations.push({
      icon: <Briefcase className="w-5 h-5 text-yellow-500" />,
      title: "Add a headline",
      description: "Summarize your professional identity in one line.",
      color: "bg-yellow-50"
    });
  }

  if (!user.phone || user.phone.trim() === "") {
    recommendations.push({
      icon: <Phone className="w-5 h-5 text-green-500" />,
      title: "Add your phone number",
      description: "Makes it easier for employee to contact you.",
      color: "bg-green-50"
    });
  }

  if (!user.portfolio || user.portfolio.trim() === "") {
    recommendations.push({
      icon: <Star className="w-5 h-5 text-blue-500" />,
      title: "Add your portfolio",
      description: "Show your work and projects to stand out.",
      color: "bg-blue-50"
    });
  }

  if (!user.city || user.city.trim() === "") {
    recommendations.push({
      icon: <MapPin className="w-5 h-5 text-purple-500" />,
      title: "Add your city",
      description: "Helps Employees know your location.",
      color: "bg-purple-50"
    });
  }

  if (!user.country || user.country.trim() === "") {
    recommendations.push({
      icon: <Globe className="w-5 h-5 text-teal-500" />,
      title: "Add your country",
      description: "Completes your profile location details.",
      color: "bg-teal-50"
    });
  }

  if (!user.address || user.address.trim() === "") {
    recommendations.push({
      icon: <MapPin className="w-5 h-5 text-pink-500" />,
      title: "Add your address",
      description: "Provides employee full context of your location.",
      color: "bg-pink-50"
    });
  }

  if (!user.postal || user.postal.trim() === "") {
    recommendations.push({
      icon: <CreditCard className="w-5 h-5 text-indigo-500" />,
      title: "Add your postal code",
      description: "Completes your location details for precision.",
      color: "bg-indigo-50"
    });
  }

  if (!user.skills || user.skills.length < 3) {
    recommendations.push({
      icon: <Star className="w-5 h-5 text-fuchsia-500" />,
      title: "Add at least 3 skills",
      description: "Highlight your expertise and make your profile stand out.",
      color: "bg-fuchsia-50"
    });
  }

  return recommendations;
};

const ApplicantDashboard = ({ setActiveTab }) => {
  const { userData, setUserData, backendUrl, profileScore } = useContext(AppContext);
  const [updatePopUpState, setUpdatePopUpState] = useState("hidden");

  // ---------- Picture Update ----------
  const [pictureLoading, setPictureLoading] = useState(false)
  const changePicture = async (profilePicture) => {
    setPictureLoading(true)
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
    } finally {
      setPictureLoading(false)
    }
  };

  // ---------- Form Data ----------
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

  // sync with userData whenever it changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData?.name || "",
        phone: userData?.phone || "",
        headline: userData?.headline || "",
        portfolio: userData?.portfolio || "",
        address: userData?.address || "",
        city: userData?.city || "",
        postal: userData?.postal || "",
        skills: userData?.skills || []
      });
    }
  }, [userData]);

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

  const recommendations = getProfileRecommendations(userData);

  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const getNotifications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications/get`);
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        setNotifications(null)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setNotificationsLoading(false)
    }
  }

  useEffect(() => {
    getNotifications();
  }, [])

  console.log(notifications);


  return (
    <>
      <div className="p-5 w-full min-h-[calc(100vh-4.6rem)] overflow-y-auto">
        {/* Profile Header */}
        <div className="p-4 flex gap-4 items-center">
          <div className="relative">
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-25 h-25 rounded-full overflow-hidden flex items-center justify-center">
                {pictureLoading ?
                  <span className="animate-spin"><Loader /></span> :
                  userData?.profilePicture ? (
                    <Img
                      src={userData?.profilePicture}
                      style=" w-full h-full object-cover z-10 shadow-xl"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-700 z-10">
                      {userData?.name?.[0] || "?"}
                    </span>
                  )
                }
              </div>
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
              <Camera size={20} className="text-gray-400 text-sm" />
            </label>
          </div>
          <div className="p-4">
            <h1 className="font-bold">Hi, {userData?.name}</h1>
            <span className="text-sm">{userData?.email}</span>
          </div>
        </div >

        <div className="shadow-md mt-6 border border-gray-200 rounded-lg p-5 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 flex items-baseline gap-2">
            <Bell size={20} /> Latest Notifications <Link to={''} className="text-blue-500 text-sm">/ View All</Link>
          </h2>

          <div className="mt-4 shadow-md rounded-md space-y-3 text-sm text-gray-700">
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin w-6 h-6 text-gray-500" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 italic text-center py-6">
                No new notifications.
              </p>
            ) : (
              notifications.map((not, i) => (
                <div
                  key={not._id || i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 hover:border-blue-300 transition-all duration-200 rounded-md px-4 py-3 bg-gray-50 hover:bg-blue-50"
                >
                  <div>
                    <span className="font-medium text-gray-800">{not.subject}</span>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(not.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full mt-2 sm:mt-0 ${not.type === "Application"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                      }`}
                  >
                    {not.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>


        {/* Profile Score */}
        <div className="p-4 mt-5 bg-white rounded-lg shadow-md border border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800">Your Profile Score</h2>
          <h3 className="text-2xl font-bold text-[var(--primary-color)] mt-1">{profileScore}%</h3>
          <div className="w-full mt-3 bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full ${profileScore <= 25
                ? "bg-red-500"
                : profileScore <= 50
                  ? "bg-orange-500"
                  : profileScore <= 75
                    ? "bg-yellow-400"
                    : "bg-green-500"
                } transition-all duration-500`}
              style={{ width: `${profileScore}%` }}
            ></div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Improve Your Profile Score</h3>
            <div className="mt-2 space-y-3">
              {recommendations.length === 0 ? (
                <div className="p-4 bg-green-100 text-green-800 rounded-md font-medium">
                  🎉 Great! Your profile is fully optimized.
                </div>
              ) : (
                recommendations.map((rec, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-3 rounded-md ${rec.color} shadow-sm`}>
                    <div className="flex items-center gap-3">
                      <div className="mr-3">{rec.icon}</div>
                      <div>
                        <div className="font-medium text-gray-800">{rec.title}</div>
                        <div className="text-sm text-gray-600">{rec.description}</div>
                      </div>
                    </div>
                    <div className="bg-white px-2 py-1 rounded-md shadow-sm"><Pencil onClick={() => setActiveTab('my-profile')} /></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Update Profile Pop Up */}
        <div
          className={`w-full backdrop-blur-sm flex items-center justify-center rounded h-screen border fixed z-51 top-0 left-0 ${updatePopUpState}`}
        >
          <div className=" w-[70%] h-[70%] border relative bg-white shadow-2xl rounded-2xl overflow-y-auto p-4 ">
            <X
              onClick={() => setUpdatePopUpState("hidden")}
              size={20}
              className="absolute right-5 top-5 cursor-pointer"
            />

            <h1 className="text-[var(--primary-color)] font-semibold">Update Your Profile</h1>

            <form onSubmit={updateProfile} className="flex flex-col gap-2 mt-3">
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <label className="font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <label className="font-medium">Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <label className="font-medium">Portfolio</label>
              <input
                type="text"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <hr className="mt-5" />
              <h2 className="text-[var(--primary-color)]">Location </h2>

              <label className="font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <label className="font-medium">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <label className="font-medium">Postal Code</label>
              <input
                type="text"
                name="postal"
                value={formData.postal}
                onChange={handleChange}
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

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
                className="p-2 border-2 focus:border-[var(--primary-color)] rounded"
              />

              <button
                type="submit"
                className="mt-4 bg-[var(--primary-color)] text-white py-2 rounded hover:opacity-90 transition"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div >
    </>
  );
};

export default ApplicantDashboard;