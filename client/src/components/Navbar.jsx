import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMenu, FiX } from "react-icons/fi";
import Loading from "./Loading";
import Img from "./Image";

// React iCONS
import { IoMdPerson } from "react-icons/io";
import { BanIcon, ExternalLink, GalleryVerticalEnd, Link } from "lucide-react";

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
        setUserData(null);
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

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkIsAdmin = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/check-admin`);
        if (data.success) {
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (isLoggedIn) {
      checkIsAdmin();
    } else {
      setIsAdmin(false); // reset when logged out
    }
  }, [isLoggedIn, backendUrl]);


  if (loading) {
    return <Loading />;
  }

  const [companyDetails, setCompanyDetails] = useState([]);
  const getCompanyDetails = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/followedaccounts`);
      if (data.success) {
        setCompanyDetails(data.companies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (userData?.role === "user") getCompanyDetails();
  }, []);

  console.log('companyDetails', companyDetails)

  return (
    <>
      <nav className="flex items-center border-b-gray-200 border-b px-4 py-4 justify-between">
        {/* Left Logo */}
        <div className="flex items-center gap-6">
          <NavLink to={"/"}>
            <img src="/logo.webp" className="w-32" alt="" />
          </NavLink>

          {isLoggedIn && <div className="hidden md:flex items-baseline gap-6">
            <NavLink
              to={"/"}
              className={`relative text-[0.9rem] pb-[0.5rem] ${location.pathname === "/" ? "font-bold text-[var(--primary-color)]" : ""
                }`}
            >
              Home
            </NavLink>
            <NavLink
              to={"/find-jobs"}
              className={`relative text-[0.9rem] pb-[0.5rem] ${location.pathname === "/find-jobs" ? "font-bold text-[var(--primary-color)]" : ""
                }`}
            >
              Find Jobs
            </NavLink>
            <NavLink
              to={"/help-center"}
              className={`relative text-[0.9rem] pb-[0.5rem] ${location.pathname === "/help-center" ? "font-bold text-[var(--primary-color)]" : ""
                }`}
            >
              Help Center
            </NavLink>
            <NavLink
              to={"/company-reviews"}
              className={`relative ${isLoggedIn && "hidden"} text-[0.9rem] pb-[0.5rem] ${location.pathname === "/company-reviews"
                ? "font-bold text-[var(--primary-color)]"
                : ""
                }`}
            >
              Company Reviews
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
              {userData?.role === "user" && <div className="relative group">
                {/* Trigger button */}
                <span
                  className="rounded-full flex border border-gray-300 p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                  <GalleryVerticalEnd size={23} />
                </span>

                {/* Dropdown menu */}
                <ul className="absolute w-80 right-0 bg-white border rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 
    p-3 group-hover:pointer-events-auto transition-opacity duration-200 z-50 max-h-96 overflow-y-auto">
                  <NavLink to={"/followed-accounts"} className="w-full items-center gap-3 text-xs flex justify-end mb-4">
                    Followed Accounts<ExternalLink size={20} className="text-blue-500" />
                  </NavLink>
                  {companyDetails?.length === 0 ? <div className="w-full justify-center flex items-center gap-3 text-sm"><BanIcon size={20} />  No Followed Accounts </div> : companyDetails?.slice(0, 5)?.map((com) => (
                    <li
                      key={com._id}
                      className="flex border border-gray-300 items-center gap-3 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                      onClick={() => navigate('/company-profile/' + com.authId)}
                    >
                      <Img
                        src={`${backendUrl}/uploads/${com.profilePicture}`}
                        style={"w-10 h-10  rounded-full border border-gray-200 object-cover"}
                      />
                      <div className="flex-1 flex flex-col">
                        <span className="font-semibold text-sm text-gray-800">{com.company || com.name}</span>
                        <span className="text-xs text-gray-500">{com.followers} Followers</span>
                      </div>
                    </li>
                  ))}
                </ul>

              </div>}


              <NavLink to={'/dashboard'} className="p-2 border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full">
                <IoMdPerson size={25} />
              </NavLink>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-10 flex justify-center items-center w-10 text-white rounded-full bg-black cursor-pointer overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all duration-200 relative"
              >
                {userData?.profilePicture ? (
                  <img
                    loading="lazy"
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
                  <ul className="py-2 flex flex-col gap-1">
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
              <NavLink
                to={"/login"}
                className={` ${location.pathname === "/login" ? "underline" : ""
                  }`}
              >
                <button>
                  Sign In
                </button>
              </NavLink>
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
          <NavLink to="/find-jobs" onClick={() => setMobileMenu(false)}>
            Find Jobs
          </NavLink>
          <NavLink to="/company-reviews" onClick={() => setMobileMenu(false)}>
            Company Reviews
          </NavLink>
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