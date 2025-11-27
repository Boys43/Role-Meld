import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Circular Profile score
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
  FileText, Image, Briefcase, Phone, Globe, MapPin, CreditCard, Star, Pencil,
  Camera, X, Loader, Bell, User, Calendar, Award, BookOpen, Video, Link2,
  Layers, ImageIcon
} from "lucide-react";
import Img from "./Image";
import { Link } from "react-router-dom";

// Enhanced recommendation system with tab navigation
const getProfileRecommendations = (user) => {
  const recommendations = [];

  // BASIC INFO TAB
  if (!user.profilePicture || user.profilePicture.trim() === "") {
    recommendations.push({
      icon: <Camera className="w-5 h-5 text-orange-500" />,
      title: "Add a profile picture",
      description: "Profiles with pictures are more trusted and get 40% more views.",
      color: "bg-orange-50",
      tab: "basic",
      field: "profilePicture"
    });
  }

  if (!user.coverImage || user.coverImage.trim() === "") {
    recommendations.push({
      icon: <ImageIcon className="w-5 h-5 text-purple-500" />,
      title: "Add a cover image",
      description: "Make your profile stand out with a professional cover image.",
      color: "bg-purple-50",
      tab: "basic",
      field: "coverImage"
    });
  }

  if (!user.currentPosition || user.currentPosition.trim() === "") {
    recommendations.push({
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      title: "Add your current position",
      description: "Let recruiters know your current role.",
      color: "bg-blue-50",
      tab: "basic",
      field: "currentPosition"
    });
  }

  if (!user.description || user.description.trim() === "") {
    recommendations.push({
      icon: <FileText className="w-5 h-5 text-indigo-500" />,
      title: "Write about yourself",
      description: "A compelling description increases profile engagement by 60%.",
      color: "bg-indigo-50",
      tab: "basic",
      field: "description"
    });
  }

  if (!user.phone || user.phone.trim() === "") {
    recommendations.push({
      icon: <Phone className="w-5 h-5 text-green-500" />,
      title: "Add your phone number",
      description: "Makes it easier for recruiters to contact you directly.",
      color: "bg-green-50",
      tab: "basic",
      field: "phone"
    });
  }

  if (!user.dob) {
    recommendations.push({
      icon: <Calendar className="w-5 h-5 text-pink-500" />,
      title: "Add your date of birth",
      description: "Complete your basic information.",
      color: "bg-pink-50",
      tab: "basic",
      field: "dob"
    });
  }

  if (!user.qualification || user.qualification.trim() === "") {
    recommendations.push({
      icon: <BookOpen className="w-5 h-5 text-cyan-500" />,
      title: "Add your qualification",
      description: "Specify your highest education level.",
      color: "bg-cyan-50",
      tab: "basic",
      field: "qualification"
    });
  }

  if (!user.city || user.city.trim() === "") {
    recommendations.push({
      icon: <MapPin className="w-5 h-5 text-purple-500" />,
      title: "Add your city",
      description: "Helps recruiters find local talent.",
      color: "bg-purple-50",
      tab: "basic",
      field: "city"
    });
  }

  if (!user.country || user.country.trim() === "") {
    recommendations.push({
      icon: <Globe className="w-5 h-5 text-teal-500" />,
      title: "Add your country",
      description: "Complete your location details.",
      color: "bg-teal-50",
      tab: "basic",
      field: "country"
    });
  }

  if (!user.address || user.address.trim() === "") {
    recommendations.push({
      icon: <MapPin className="w-5 h-5 text-pink-500" />,
      title: "Add your address",
      description: "Provides full context of your location.",
      color: "bg-pink-50",
      tab: "basic",
      field: "address"
    });
  }

  if (!user.postal || user.postal.trim() === "") {
    recommendations.push({
      icon: <CreditCard className="w-5 h-5 text-indigo-500" />,
      title: "Add your postal code",
      description: "Complete your location details for precision.",
      color: "bg-indigo-50",
      tab: "basic",
      field: "postal"
    });
  }

  // PROFESSIONAL INFO
  if (!user.headline || user.headline.trim() === "") {
    recommendations.push({
      icon: <Briefcase className="w-5 h-5 text-yellow-500" />,
      title: "Add a professional headline",
      description: "Summarize your professional identity in one line.",
      color: "bg-yellow-50",
      tab: "basic",
      field: "headline"
    });
  }

  if (!user.resume || user.resume.trim() === "") {
    recommendations.push({
      icon: <FileText className="w-5 h-5 text-red-500" />,
      title: "Upload your resume",
      description: "Profiles with resumes get 3x more interview calls.",
      color: "bg-red-50",
      tab: "basic",
      field: "resume"
    });
  }

  if (!user.portfolio || user.portfolio.trim() === "") {
    recommendations.push({
      icon: <Link2 className="w-5 h-5 text-blue-500" />,
      title: "Add your portfolio",
      description: "Showcase your work and projects to stand out.",
      color: "bg-blue-50",
      tab: "basic",
      field: "portfolio"
    });
  }

  if (!user.videoUrl || user.videoUrl.trim() === "") {
    recommendations.push({
      icon: <Video className="w-5 h-5 text-red-500" />,
      title: "Add a video introduction",
      description: "Video profiles get 5x more engagement.",
      color: "bg-red-50",
      tab: "basic",
      field: "videoUrl"
    });
  }

  // SKILLS TAB
  if (!user.skills || user.skills.length < 3) {
    recommendations.push({
      icon: <Star className="w-5 h-5 text-fuchsia-500" />,
      title: "Add at least 3 skills",
      description: "Highlight your expertise and make your profile searchable.",
      color: "bg-fuchsia-50",
      tab: "skills",
      field: "skills"
    });
  }

  // EDUCATION TAB
  if (!user.education || user.education.length === 0) {
    recommendations.push({
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      title: "Add your education",
      description: "Add at least one education entry to boost credibility.",
      color: "bg-blue-50",
      tab: "education",
      field: "education"
    });
  }

  // EXPERIENCE TAB
  if (!user.experience || user.experience.length === 0) {
    recommendations.push({
      icon: <Briefcase className="w-5 h-5 text-green-500" />,
      title: "Add work experience",
      description: "Showcase your professional journey and achievements.",
      color: "bg-green-50",
      tab: "experience",
      field: "experience"
    });
  }

  // PROJECTS TAB
  if (!user.projects || user.projects.length === 0) {
    recommendations.push({
      icon: <Layers className="w-5 h-5 text-purple-500" />,
      title: "Add your projects",
      description: "Demonstrate your practical skills with real projects.",
      color: "bg-purple-50",
      tab: "projects",
      field: "projects"
    });
  }

  // AWARDS TAB
  if (!user.awards || user.awards.length === 0) {
    recommendations.push({
      icon: <Award className="w-5 h-5 text-yellow-500" />,
      title: "Add your achievements",
      description: "Highlight awards and recognitions you've received.",
      color: "bg-yellow-50",
      tab: "awards",
      field: "awards"
    });
  }

  // SOCIAL LINKS
  let socialCount = 0;
  if (user.linkedin && user.linkedin.trim() !== "") socialCount++;
  if (user.twitter && user.twitter.trim() !== "") socialCount++;
  if (user.facebook && user.facebook.trim() !== "") socialCount++;
  if (user.instagram && user.instagram.trim() !== "") socialCount++;
  if (user.youtube && user.youtube.trim() !== "") socialCount++;
  if (user.tiktok && user.tiktok.trim() !== "") socialCount++;
  if (user.github && user.github.trim() !== "") socialCount++;
  if (user.customSocialNetworks && user.customSocialNetworks.length > 0) {
    socialCount += user.customSocialNetworks.filter(s => s.url && s.url.trim() !== "").length;
  }

  if (socialCount < 2) {
    recommendations.push({
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      title: "Connect social profiles",
      description: "Add at least 2 social network links to increase visibility.",
      color: "bg-blue-50",
      tab: "basic",
      field: "linkedin"
    });
  }

  return recommendations;
};

const ApplicantDashboard = ({ setActiveTab }) => {
  const { userData, setUserData, backendUrl, profileScore } = useContext(AppContext);
  const navigate = useNavigate();
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

  // ---------- Navigation Handler ----------
  const handleNavigateToProfile = (tab, field) => {
    navigate('/dashboard/profile', {
      state: {
        activeTab: tab,
        focusField: field
      }
    });
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
                recommendations.slice(0, 10).map((rec, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-3 rounded-md ${rec.color} shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-center gap-3">
                      <div className="mr-3">{rec.icon}</div>
                      <div>
                        <div className="font-medium text-gray-800">{rec.title}</div>
                        <div className="text-sm text-gray-600">{rec.description}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigateToProfile(rec.tab, rec.field)}
                      className="bg-white px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-all hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      <span className="text-sm font-medium">Fix</span>
                    </button>
                  </div>
                ))
              )}
              {recommendations.length > 10 && (
                <div className="text-center text-sm text-gray-500 mt-2">
                  + {recommendations.length - 10} more recommendations
                </div>
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