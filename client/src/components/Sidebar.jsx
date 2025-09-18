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
      { name: "Dashboard", key: "recruiterdashboard", icon: <MdOutlineDashboard size={30} /> },
      { name: "Applications", key: "applications", icon: <MdFindInPage size={30} /> },
      { name: "List Job", key: "list-job", icon: <CiViewList size={30} /> },
      { name: "Listed Jobs", key: "listed-jobs", icon: <CiViewList size={30} /> },
    ];
  } else {
    navLinks = [
      { name: "Dashboard", key: "userdashboard", icon: <MdOutlineDashboard size={30} /> },
      { name: "Saved Jobs", key: "savedjobs", icon: <CiBookmarkCheck size={30} /> },
      { name: "Applied Jobs", key: "applied-jobs", icon: <VscGitStashApply size={30} /> },
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
          fixed lg:sticky top-0 left-0 bg-[var(--secondary-color)] 
          transition-all duration-300 border-r border-[var(--primary-color)] 
          text-white flex flex-col justify-between z-40`}
      >
        {/* User Info */}
        <div className="flex flex-col gap-4 p-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden">

              <img
                src={`${backendUrl}/uploads/${userData?.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {!toggleNav && <h4 className={`font-bold ${toggleNav ? "hidden lg:block" : "block"}`}>
              {userData?.name}
            </h4>}

          </div>

          {/* Navigation */}
          <ul className="flex flex-col gap-2 mt-4">
            {navLinks.map((e) => (
              <li
                key={e.key}
                onClick={() => {
                  setActiveTab(e.key);
                  if (isMobile) setToggleNav(false); // auto close sidebar on mobile
                }}
                className={`flex items-center gap-2 px-2 py-1 transition-all rounded cursor-pointer border border-[var(--primary-color)]/30
                  ${activeTab === e.key
                    ? "text-[var(--primary-color)] translate-x-2 font-semibold bg-[var(--primary-color)]/30 border border-[var(--primary-color)]"
                    : "hover:bg-[var(--primary-color)]/5"
                  }`}
              >
                {e.icon}
                {!toggleNav && <span>{e.name}</span>}
              </li>
            ))}
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
            <IoMdExit size={25} />
          ) : (
            <>
              Logout <IoMdExit size={25} />
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
