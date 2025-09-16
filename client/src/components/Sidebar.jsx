// components/Sidebar.jsx
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { MdOutlineDashboard } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdFindInPage } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { VscGitStashApply } from "react-icons/vsc";
import { CiViewList } from "react-icons/ci";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userData, backendUrl } = useContext(AppContext);

  let navLinks;

  if (userData?.role === "recruiter") {
    navLinks = [
      { name: "Dashboard", key: "recruiterdashboard", icon: <MdOutlineDashboard size={30} /> },
      { name: "Applications", key: "applications", icon: <MdFindInPage size={30} /> },
      { name: "List Job", key: "list-job", icon: <CiViewList size={30} /> },
    ]
  } else {
    navLinks = [
      { name: "Dashboard", key: "userdashboard", icon: <MdOutlineDashboard size={30} /> },
      { name: "Saved Jobs", key: "savedjobs", icon: <CiBookmarkCheck size={30} /> },
      { name: "Find Jobs", key: "find-jobs", icon: <MdFindInPage size={30} /> },
      { name: "Applied Jobs", key: "applied-jobs", icon: <VscGitStashApply size={30} /> },
    ]
  }

  const [toggleNav, setToggleNav] = useState(false);

  return (
    <aside
      className={`${toggleNav ? "w-20 items-center py-6 px-2" : "w-64 p-6"
        } h-100vh overflow bg-white flex flex-col gap-4 sticky top-0 justify-between border-r-[var(--primary-color)]`}
    >
      {/* User Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden">
            <img
              src={`${backendUrl}/uploads/${userData?.profilePicture}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className={`font-bold ${toggleNav ? "hidden" : "block"}`}>
            {userData?.name}
          </h4>
        </div>

        {/* Navigation */}
        <ul className="flex flex-col gap-2">
          {navLinks.map((e) => (
            <li
              key={e.key}
              onClick={() => setActiveTab(e.key)}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors
                ${activeTab === e.key
                  ? "text-[var(--primary-color)] font-semibold bg-[var(--primary-color)]/5 border border-[var(--primary-color)]"
                  : "hover:bg-[var(--primary-color)]/5"
                }`}
            >
              {toggleNav ? (
                e.icon
              ) : (
                <>
                  {e.icon} <span>{e.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Toggle Button */}
        <span
          onClick={() => setToggleNav(!toggleNav)}
          className="bg-[var(--primary-color)] absolute top-5 right-[-1rem] rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer"
        >
          {toggleNav ? <FaChevronRight /> : <FaChevronLeft />}
        </span>
      </div>

      {/* Logout */}
      <div className="cursor-pointer bg-[var(--primary-color)]/10 border-2 border-[var(--primary-color)] px-5 py-2 rounded-2xl text-[var(--primary-color)] flex items-center justify-between">
        Logout <IoMdExit size={25} />
      </div>
    </aside>
  );
};

export default Sidebar;