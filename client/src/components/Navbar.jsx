import { useContext, useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMenu, FiX } from "react-icons/fi";
import Loading from "./Loading";
import Img from "./Image"; // Assuming this is a local component for image rendering
import { AnimatePresence, motion } from "framer-motion";

// React iCONS
import { IoMdPerson, IoMdExit } from "react-icons/io";
import { Gauge, Briefcase, HelpCircle, Building2, UserCircle, LogOut } from "lucide-react";

// --- Configuration ---
const USER_NAV_LINKS = [
  { to: "/", icon: Gauge, label: "Home" },
  { to: "/find-jobs", icon: Briefcase, label: "Find Jobs" },
  { to: "/company-reviews", icon: Building2, label: "Company Reviews" },
  { to: "/help-center", icon: HelpCircle, label: "Help Center" },
];

const Navbar = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, loading, backendUrl, setIsLoggedIn, setUserData, userData } =
    useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [followedAccounts, setFollowedAccounts] = useState([]);

  // Refs for managing outside clicks
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Set default credentials for Axios
  axios.defaults.withCredentials = true;

  // --- Utility Functions ---

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
    // Ensure mobile menu is closed when opening dropdown
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen((prev) => !prev);
    // Ensure dropdown is closed when opening mobile menu
    if (isUserDropdownOpen) setIsUserDropdownOpen(false);
  };

  const handleLinkClick = (path) => {
    navigate(path);
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // --- API Functions ---

  const logout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success(data.message);
        handleLinkClick("/"); // Navigates and closes menus
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const checkIsAdmin = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/check-admin`);
      setIsAdmin(data.success && data.isAdmin);
    } catch (error) {
      console.error("Admin check failed:", error);
      setIsAdmin(false);
    }
  };

  const getFollowedAccounts = async () => {
    if (userData?.role === "user") {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/followedaccounts`);
        if (data.success) {
          setFollowedAccounts(data.companies);
        }
      } catch (error) {
        console.error("Followed accounts fetch failed:", error);
      }
    } else {
      setFollowedAccounts([]);
    }
  };

  // --- Effects ---

  // Check Admin status on login change
  useEffect(() => {
    if (isLoggedIn) {
      checkIsAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [isLoggedIn, backendUrl]);

  // Fetch followed accounts when user logs in/out or role changes
  useEffect(() => {
    getFollowedAccounts();
  }, [userData?.role, isLoggedIn, backendUrl]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // User dropdown
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show loading state
  if (loading) {
    return <Loading />;
  }

  // --- Reusable Components/JSX ---

  const DesktopNavLinks = () => (
    <div className="hidden md:flex items-baseline gap-6">
      {USER_NAV_LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={`relative text-sm pb-2 transition-colors duration-200 ${location.pathname === to
            ? "font-bold text-[var(--primary-color)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--primary-color)]"
            : "text-gray-600 hover:text-[var(--primary-color)]"
            }`}
        >
          {label}
        </NavLink>
      ))}
    </div>
  );

  const MobileNavLinks = () => (
    <div
      ref={mobileMenuRef}
      className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg p-4 space-y-4 transition-transform duration-300 ease-out z-40 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {USER_NAV_LINKS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => handleLinkClick(to)}
          className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon size={20} className="text-[var(--primary-color)]" />
          {label}
        </NavLink>
      ))}

      {isLoggedIn ? (
        <>
          <NavLink
            to="/dashboard"
            onClick={() => handleLinkClick("/dashboard")}
            className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <UserCircle size={20} className="text-[var(--primary-color)]" />
            Dashboard
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => handleLinkClick("/admin")}
              className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Gauge size={20} className="text-red-500" />
              Admin Panel
            </NavLink>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
          >
            <LogOut size={20} />
            Logout
          </button>
        </>
      ) : (
        <NavLink
          to="/login"
          onClick={() => handleLinkClick("/login")}
          className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <IoMdExit size={20} className="text-[var(--primary-color)]" />
          Sign In
        </NavLink>
      )}
    </div>
  );

  const score = userData?.profileScore ?? 0;
  const [showReminder, setShowReminder] = useState(false);

  // Dynamic level logic
  const getStatus = (score) => {
    if (score === 100) return { label: "Excellent", color: "green", msg: "🔥 You're fully active and ready to shine!" };
    if (score >= 75) return { label: "Good", color: "blue", msg: "💪 Great progress! Just polish a few details." };
    if (score >= 50) return { label: "Average", color: "yellow", msg: "⚡ You’re getting there — add more details to boost visibility!" };
    if (score >= 25) return { label: "Poor", color: "orange", msg: "🚀 Start completing your profile to unlock more opportunities!" };
    return { label: "Inactive", color: "red", msg: "⚠️ Your account is inactive. Complete your profile to activate it." };
  };

  const { label, color, msg } = getStatus(score);
  const isActive = score >= 80;

  useEffect(() => {
    if (!isActive) {
      const interval = setInterval(() => {
        setShowReminder(true);
      }, 600000); // every 10 minutes
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const UserProfileDropdown = () => (
    <div
      ref={userDropdownRef}
      className="relative flex items-center gap-4"
    >
      <div className="relative flex items-center gap-4">
        {/* Pill UI */}
        <div
          className={`flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${userData?.isActive ? "bg-green-500" : "bg-red-500"} animate-pulse`}></span>
          <span className={`text-sm font-medium ${userData?.isActive ? "text-green-500" : "text-red-500"}`}>
            {userData?.isActive ?
              "Active" :
              "InActive"}
          </span>
        </div>

        {userData?.profileScore === 100 && userData?.reviewStatus === "underReview" ?
          <div
            className={`flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm`}
          >
            <span className={`w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse`}></span>
            <span className={`text-sm font-medium text-yellow-500`}>
              Under Review
            </span>
          </div> :
          null}

        <div
          className={`flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm`}
        >
          <span className={`w-2.5 h-2.5 rounded-full bg-${color}-500 animate-pulse`}></span>
          <span className={`text-sm font-medium text-${color}-500`}>
            {label}
          </span>
          <div
            className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-${color}-100 text-${color}-700`}
          >
            Score: {score}
          </div>
        </div>

        {/* Dropdown Reminder */}
        <AnimatePresence>
          {!isActive && showReminder && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute right-0 top-10 w-72 bg-white/90 backdrop-blur-md border border-${color}-100 shadow-lg rounded-2xl p-4 z-50`}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-${color}-100 text-${color}-500 animate-pulse`}
                >
                  ⚠️
                </div>
                <div className="flex-1 text-center">
                  <h4 className="font-semibold text-gray-800">Profile Status</h4>
                  <span className="text-gray-600 text-sm mt-1 block">{msg}</span>
                  <button
                    onClick={() => setShowReminder(false)}
                    className={`mt-3 w-full bg-${color}-500 hover:bg-${color}-600 text-white text-sm font-semibold py-2 rounded-lg transition-all`}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <h4 className="hidden lg:block text-sm text-[var(--primary-color)]">
        Hi, {userData?.name || "Buddy"}
      </h4>

      {/* Profile/Followed Accounts Button */}
      <span
        onClick={toggleUserDropdown}
        className="h-10 w-10 text-white rounded-full bg-black cursor-pointer overflow-hidden ring-2 ring-transparent hover:ring-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="User menu"
      >
        {userData?.profilePicture ? (
          <Img
            src={userData.profilePicture}
            style="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold flex items-center justify-center h-full w-full">
            {userData?.name?.[0]?.toUpperCase() || "?"}
          </span>
        )}
      </span>

      {/* Dropdown Menu */}
      {isUserDropdownOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100">
          <div className="p-4 border-b">
            <p className="text-sm font-semibold text-gray-800">
              {userData?.name}
            </p>
            <span className="text-sm text-gray-500">{userData?.role === "recruiter" ? "Employer" : "Job Seeker"}</span>
          </div>
          <ul className="py-2 flex flex-col">
            <li
              onClick={() => handleLinkClick("/dashboard")}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <UserCircle size={18} />
              Dashboard
            </li>
            {isAdmin && (
              <li
                onClick={() => handleLinkClick("/admin")}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors border-t border-gray-100"
              >
                <Gauge size={18} className="text-red-500" />
                Admin Panel
              </li>
            )}
            <li
              onClick={logout}
              className="cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-100"
            >
              <LogOut size={18} />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-6">
      <NavLink
        to={"/login"}
        className="font-medium text-sm transition-colors duration-200"
        onClick={() => setIsMenuOpen(false)}
      >
        Login
      </NavLink>
      <NavLink
        to={"/register"}
        onClick={() => setIsMenuOpen(false)}
      >
        <button>
          Post a job
        </button>
      </NavLink>
    </div>
  );

  // --- Main Render ---
  return (
    <nav className={`max-w-6xl mx-auto relative z-999 ${className}`}>
      <div className="flex items-center px-4 justify-between">
        {/* Left Section - Logo and Desktop Links */}
        <div className="flex items-center gap-10">
          <NavLink to={"/"}>
            {/* The image styling should be outside the component if possible, or ensure it's responsive */}
            <img src="/logo.webp" className="w-28 sm:w-32" alt="Company Logo" />
          </NavLink>
          <DesktopNavLinks />
        </div>

        {/* Right Section - Auth/User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? <UserProfileDropdown /> : <AuthButtons />}
        </div>

        {/* Mobile Hamburger/Close Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (Outside the main flex container for full width) */}
      <MobileNavLinks />
    </nav>
  );
};

export default Navbar;