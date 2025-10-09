// components/Sidebar.jsx
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Img from "./Image";
import { Blocks, Briefcase, Building, ChevronRight, Clock, LayoutDashboard, User, Users2 } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
  const [toggleNav, setToggleNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let navLinks = [
    { name: 'Analytics', key: "analytic-dashboard", icon: <LayoutDashboard size={25} /> },
    { name: 'Job Requests', key: "job-requests", icon: <Building size={25} /> },
    { name: 'Users', key: "users", icon: <User size={25} /> },
    { name: 'Recruiters', key: "recruiters", icon: <Users2 size={25} /> },
    { name: 'Employee Requests', key: "employee-requests", icon: <Clock size={25} /> },
    {
      name: 'Jobs', key: "jobs", icon: <Briefcase size={25} />,
      subTabs: [
        { name: 'Category', key: "category-manager" },
      ]
    },
    {
      name: 'Blog', key: "blog-management", icon: <Blocks size={25} />,
      subTabs: [
        { name: "Blog Management", key: "blog-management" },
        { name: "Add Blog", key: "add-blog" },
      ]
    },
  ]

  axios.defaults.withCredentials = true;

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-[var(--primary-color)] text-white p-2 rounded"
          onClick={() => setToggleNav(!toggleNav)}
        >
          <FiMenu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${toggleNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${toggleNav ? (isMobile ? "w-64 h-screen" : "w-20 ") : "w-72"} 
          fixed text-sm lg:sticky top-0 left-0 bg-[var(--secondary-color)] 
          transition-all duration-300 border-r border-[var(--primary-color)] 
          text-white flex flex-col justify-between z-40 h-screen`}
      >
        {/* User Info */}
        <div className="flex flex-col gap-4 py-4 pl-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
              {userData?.profilePicture ? (
                <Img
                  src={`${backendUrl}/uploads/${userData?.profilePicture}`}
                  style={"w-full h-full object-cover"}
                />
              ) : (
                <span>{userData?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {!toggleNav && <h4 className="font-bold whitespace-nowrap">{userData?.name}</h4>}
          </div>

          {/* Navigation */}
          <ul className="flex flex-col gap-2 mt-4">
            {navLinks.map((e, i) => {
              const isParentActive =
                activeTab === e.key || (e.subTabs && e.subTabs.some((sub) => sub.key === activeTab));
              return (
                <li key={i} className="relative group">
                  {/* Parent tab */}
                  <span
                    onClick={() => {
                      if (isMobile && e.subTabs) {
                        setActiveTab(e.key);
                      } else if (!e.subTabs) {
                        setActiveTab(e.key);
                      }
                    }}
                    className={`px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between gap-3 hover:bg-[var(--primary-color)]/10 transition 
                      ${isParentActive ? "bg-[var(--primary-color)]/20 border border-[var(--primary-color)] shadow  px-1" : ""}
                    `}
                  >
                    <span className="flex items-center gap-3">
                      {e.icon}
                      {!toggleNav && <h4 className="whitespace-nowrap">{e.name}</h4>}
                    </span>
                    {!toggleNav && <span>
                      {e.subTabs && <ChevronRight />}
                    </span>}

                  </span>

                  {/* Floating submenu (desktop only) */}
                  {e.subTabs && !isMobile && (
                    <div className="absolute top-0 left-full ml-0.5 hidden group-hover:flex flex-col bg-[var(--secondary-color)] border border-[var(--primary-color)] rounded-xl shadow-lg p-2 z-50 min-w-[230px] animate-fadeIn">
                      {e.subTabs.map((sub, idx) => (
                        <span
                          key={idx}
                          onClick={() => setActiveTab(sub.key)}
                          className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--primary-color)]/10 text-white transition flex items-center gap-2
                            ${activeTab === sub.key ? "bg-[var(--primary-color)]/20 border border-[var(--primary-color)]" : ""}
                          `}
                        >
                          {sub.icon}
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Inline submenu (mobile only) */}
                  {e.subTabs && isMobile && activeTab === e.key && (
                    <div className="flex flex-col gap-1 pl-6 mt-1">
                      {e.subTabs.map((sub, idx) => (
                        <span
                          key={idx}
                          onClick={() => setActiveTab(sub.key)}
                          className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--primary-color)]/10 text-white transition 
                            ${activeTab === sub.key ? "bg-[var(--primary-color)]/20 border border-[var(--primary-color)]" : ""}
                          `}
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}

            {/* Delete Account */}
            <li>
              <span
                onClick={() => setActiveTab("delete-account")}
                className="px-3 py-2 rounded-xl cursor-pointer bg-red-500 hover:bg-red-600 flex items-center gap-3 text-white transition border border-red-500"
              >
                <FaTrash /> {!toggleNav && <h4 className="whitespace-nowrap">Delete Account</h4>}
              </span>
            </li>
          </ul>

          {/* Toggle Button (Desktop only) */}
          {!isMobile && (
            <span
              onClick={() => setToggleNav(!toggleNav)}
              className="bg-[var(--primary-color)] absolute top-5 right-[-1rem] rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer"
            >
              {toggleNav ? <FaChevronRight /> : <FaChevronLeft />}
            </span>
          )}
        </div>

        {/* Logout */}
        <div
          className={`cursor-pointer bg-[var(--primary-color)]/10 border-2 border-[var(--primary-color)] px-3 py-2 m-4 rounded-2xl text-[var(--primary-color)] flex items-center justify-between`}
          onClick={logout}
        >
          {toggleNav ? <IoMdExit size={23} /> : <>Logout <IoMdExit size={23} /></>}
        </div>
      </aside>

      {/* Small fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
