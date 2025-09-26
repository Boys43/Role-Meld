import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { IoBookmark } from "react-icons/io5";
import { toast } from "react-toastify";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, loading, backendUrl, setIsLoggedIn, setUserData, userData } =
    useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  axios.defaults.withCredentials = true;

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        setShowDropdown(false);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  if (isLoggedIn) {
    const [isAdmin, setIsAdmin] = useState(false)
    const checkIsAdmin = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/check-admin`);
        if (data.success) {
          setIsAdmin(data.isAdmin)
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    useEffect(() => {
      checkIsAdmin();
    }, [])
  }


  if (loading) {
    return <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div role="status" aria-label="Loading" class="flex flex-col items-center gap-4">
        <div class="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl animate-spin"></div>
        <span class="text-sm text-gray-500">Loading, please wait…</span>
      </div>
    </div>

  }

  return (
    <>
      <nav className="flex items-center border-b-gray-200 border-b px-4 py-4 justify-between">
        {/* Left Logo */}
        <div className="flex items-center gap-6">
          <NavLink to={"/"}>
            <img src="/favicon.png" className="w-32" alt="" />
          </NavLink>

          {isLoggedIn && <div className="hidden md:flex items-baseline gap-6">
            {userData?.role === "user" && (
              <>
                <NavLink
                  to={"/find-jobs"}
                  className={`relative text-[0.9rem] pb-[0.5rem] ${location.pathname === "/find-jobs" ? "font-bold text-[var(--primary-color)]" : ""
                    }`}
                >
                  Find Jobs
                </NavLink>
                <NavLink
                  to={"/company-reviews"}
                  className={`relative text-[0.9rem] pb-[0.5rem] ${location.pathname === "/company-reviews"
                    ? "font-bold text-[var(--primary-color)]"
                    : ""
                    }`}
                >
                  Company Reviews
                </NavLink>
              </>
            )}

            <NavLink
              to={"/dashboard"}
              className={`relative text-[0.9rem] pb-[0.5rem] ${location.pathname === "/dashboard" ? "font-bold text-[var(--primary-color)]" : ""
                }`}
            >
              Dashboard
            </NavLink>
          </div>}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <div className="relative flex items-center gap-4">
              <h4 className="text-[var(--primary-color)]">
                Hi, {userData?.name || "Buddy"}
              </h4>
              <div
                className="h-10 w-10 flex rounded-full items-center justify-center hover:bg-[var(--primary-color)]/15 transition-all cursor-pointer border"
                onClick={() => navigate("/savedjobs")}
              >
                <IoBookmark size={25} className="text-[var(--primary-color)]" />
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
                  userData?.name?.[0]?.toUpperCase() || "?"
                )}
              </div>

              {showDropdown && (
                <div
                  tabIndex={0}
                  onBlur={() => setShowDropdown(false)}
                  className="absolute top-full right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <ul className="py-2 flex flex-col gap-2">
                    {isAdmin &&
                      <li
                        onClick={() => {
                          navigate('/admin');
                          setShowDropdown(false);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        Admin
                      </li>
                    }
                    <li
                      onClick={logout}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <button>
                <NavLink
                  to={"/login"}
                  className={` ${location.pathname === "/login" ? "underline" : ""
                    }`}
                >
                  Sign In
                </NavLink>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg p-4 space-y-4">
          {userData?.role === "user" && (
            <>
              <NavLink to="/find-jobs" onClick={() => setMobileMenu(false)}>
                Find Jobs
              </NavLink>
              <NavLink to="/company-reviews" onClick={() => setMobileMenu(false)}>
                Company Reviews
              </NavLink>
            </>
          )}
          <NavLink to="/dashboard" onClick={() => setMobileMenu(false)}>
            Dashboard
          </NavLink>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  logout();
                  setMobileMenu(false);
                }}
                className="text-left w-full text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button>
                <NavLink to="/login" onClick={() => setMobileMenu(false)}>
                  Sign In
                </NavLink>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;