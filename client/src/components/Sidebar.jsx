// components/Sidebar.jsx
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { MdOutlineDashboard } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdFindInPage } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { VscGitStashApply } from "react-icons/vsc";
import { CiViewList } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoDocumentOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiOutlineHeart } from "react-icons/hi";
import Img from "./Image";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userData, backendUrl } = useContext(AppContext);

  const [toggleNav, setToggleNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // below lg breakpoint = mobile/tablet
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let navLinks;
  if (userData?.role === "recruiter") {
    navLinks = [
      { name: "Dashboard", key: "recruiterdashboard", icon: <MdOutlineDashboard size={23} /> },
      { name: "Applications", key: "applications", icon: <MdFindInPage size={23} /> },
      { name: "My Profile", key: "recruiter-profile", icon: <MdFindInPage size={23} /> },
      {
        name: "Jobs", key: "listed-jobs", icon: <CiViewList size={23} />,
        subTabs: [
          { name: "Listed Job", key: "listed-jobs", icon: <CiViewList size={23} /> },
          { name: "List Job", key: "list-job", icon: <CiViewList size={23} /> },
        ]
      },
    ];
  } else {
    navLinks = [
      { name: "Dashboard", key: "userdashboard", icon: <MdOutlineDashboard size={23} /> },
      { name: "Saved Jobs", key: "savedjobs", icon: <HiOutlineHeart size={23} /> },
      { name: "Applied Jobs", key: "applied-jobs", icon: <VscGitStashApply size={23} /> },
      { name: "My Resumes", key: "my-resume", icon: <IoDocumentOutline size={23} /> },
      { name: "My Profile", key: "my-profile", icon: <CgProfile size={23} /> },
      { name: "Change Passowrd", key: "change-password", icon: <IoLockClosedOutline size={23} /> },
    ];
  }

  const { setIsLoggedIn, setUserData } = useContext(AppContext);

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
          ${toggleNav ? (isMobile ? "w-64 h-[100vh]" : "w-20  h-[calc(100vh-4.6rem)]") : "w-72"} 
          fixed text-sm lg:sticky top-0 left-0 bg-[var(--secondary-color)] 
          transition-all duration-300 border-r border-[var(--primary-color)] 
          text-white flex flex-col justify-between z-40`}
      >
        {/* User Info */}
        <div className="flex flex-col gap-4 py-4 pl-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
              {userData?.profilePicture ? <Img
                src={`${backendUrl}/uploads/${userData?.profilePicture}`}
                style={"w-full h-full object-cover"}
              />:
              <span>
                {userData?.name?.charAt(0).toUpperCase()}
              </span>
              }
              
            </div>
            {!toggleNav && <h4 className={`font-bold ${toggleNav ? "hidden lg:block" : "block"}`}>
              {userData?.name}
            </h4>}

          </div>

          {/* Navigation */}
          <ul className="flex flex-col gap-2 mt-4">
            {navLinks.map((e, i) => {
              const isParentActive = activeTab === e.key || (e.subTabs && e.subTabs.some(sub => sub.key === activeTab));
              return (
                <div key={i} className="overflow-x-hidden">
                  <span
                    onClick={() => setActiveTab(e.key)}
                    className={`px-3 py-2 rounded-xl cursor-pointer hover:bg-[var(--primary-color)]/10 flex items-center gap-3 text-white transition 
                  ${isParentActive ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)] translate-x-4 border shadow-[var(--primary-color)]' : ''}
                `}
                  >
                    {e.icon}
                    {e.name}
                  </span>

                  {e.subTabs && isParentActive && (
                    <div className="flex flex-col gap-1 translate-x-10 mt-2">
                      {e.subTabs.map((sub, idx) => (
                        <span
                          key={idx}
                          onClick={() => setActiveTab(sub.key)}
                          className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-[var(--primary-color)]/10 text-white transition 
                        ${activeTab === sub.key ? 'bg-[var(--primary-color)]/20 border-[var(--primary-color)] border shadow-[var(--primary-color)]' : ''}
                      `}
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <li>
              <span
                onClick={() => setActiveTab('delete-account')}
                className={`px-3 py-2 rounded-l-xl cursor-pointer bg-red-400 hover:bg-red-500 flex items-center gap-3 text-white transition border border-red-500
                `}
              >
                <FaTrash className="text-red-600" /> Delete Account
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
          {toggleNav ? (
            <IoMdExit size={23} />
          ) : (
            <>
              Logout <IoMdExit size={23} />
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
