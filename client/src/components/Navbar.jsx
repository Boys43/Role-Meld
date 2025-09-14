import { useContext, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import axios from "axios";
import { IoBookmark } from "react-icons/io5";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const { isLoggedIn, loading, backendUrl, setIsLoggedIn, setUserData, userData } = useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);
  axios.defaults.withCredentials = true;

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`)
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(false)
        setShowDropdown(false)
        navigate('/')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)

    }
  }

  if (loading) {
    return <nav className="p-4">Loading...</nav>;
  }

  return (
    <>
      <nav className="flex items-center border-b-gray-200 border-b-[1px] px-4 py-4 justify-between">
        <div className="flex items-center gap-6">
          <NavLink to={"/"}>
            <img src='/favicon.png' className="w-32" alt="" />
          </NavLink>
          <NavLink
            to={"/find-jobs"}
            className={`relative text-[0.9rem] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[var(--primary-color)] after:absolute after:bottom-[-5%] after:left-0 pb-[0.5rem] ${location.pathname === "/" ? "after:w-full" : ""
              }`}
          >
            Find Jobs
          </NavLink>
          <NavLink
            to={"/company-reviews"}
            className={`relative text-[0.9rem] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[var(--primary-color)] after:absolute after:bottom-[-5%] after:left-0 pb-[0.5rem] ${location.pathname === "/company-reviews" ? "after:w-full" : ""
              }`}
          >
            Company reviews
          </NavLink>
          {userData?.role === "user" ? (
            <NavLink
              to="/userdashboard"
              className={`relative text-[0.9rem] after:content-[''] after:block after:w-0 after:h-[2px] 
      after:bg-[var(--primary-color)] after:absolute after:bottom-[-5%] after:left-0 pb-[0.5rem] 
      ${location.pathname === "/userdashboard" ? "after:w-full" : ""}`}
            >
              Dashboard
            </NavLink>
          ) : userData?.role === "recruiter" ? (
            <NavLink
              to="/recruiterdashboard"
              className={`relative text-[0.9rem] after:content-[''] after:block after:w-0 after:h-[2px] 
      after:bg-[var(--primary-color)] after:absolute after:bottom-[-5%] after:left-0 pb-[0.5rem] 
      ${location.pathname === "/recruiterdashboard" ? "after:w-full" : ""}`}
            >
              Dashboard
            </NavLink>
          ) : null}

        </div>
        <div className="flex items-baseline gap-6">
          {isLoggedIn ?
            <div className="relative flex  items-center gap-4">
              <h4 className="text-[var(--primary-color)]">Hi, {userData?.name || "Buddy"}</h4>
              <div className="h-10 w-10 flex rounded-full items-center justify-center hover:bg-[var(--primary-color)]/15 transition-all cursor-pointer border" onClick={()=>navigate('/savedjobs')}>
                <IoBookmark size={25} className="text-[var(--primary-color)]  " />
              </div>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-10 flex justify-center items-center w-10 text-white rounded-full bg-black cursor-pointer overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all duration-200 relative"
              >
                {userData?.profilePicture ? (
                  <img
                    src={`${backendUrl}/uploads/${userData.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userData?.name ? userData.name[0].toUpperCase() : "?"
                )}
              </div>

              {showDropdown && (
                <div className="absolute top-full right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <ul className="py-2">
                    <li
                      onClick={logout}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>

            : (
              <div className="flex gap-4 items-center ">
                <NavLink
                  to={"/login"}
                  className={`relative text-[0.9rem] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[var(--primary-color)] after:absolute after:bottom-[-5%] after:left-0 pb-[0.5rem] text-[var(--primary-color)] font-bold ${location.pathname === "/login" ? "after:w-full" : ""
                    }`}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to={"/company-reviews"}
                  className={`relative text-[0.9rem] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[var(--primary-color)] after:absolute after:bottom-[-5%] after:left-0 pb-[0.5rem] ${location.pathname === "/post-jobs" ? "after:w-full" : ""
                    }`}
                >
                  Empoyers / Post Jobs
                </NavLink>
              </div>)
          }
        </div>
      </nav>
    </>
  );
};


export default Navbar;
