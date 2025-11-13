// components/Sidebar.jsx
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  Calendar,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Plus,
  ArrowLeft,
  Menu,
  X
} from "lucide-react";
import Img from "./Image";
import { FaArrowLeft } from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-btn')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  // Modern navigation structure matching the image
  const navLinks = [
    { name: "Dashboard", key: "dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Jobs", key: "jobs", icon: <Briefcase size={20} /> },
    { name: "Applicants", key: "applicants", icon: <Users size={20} /> },
    { name: "Candidates", key: "candidates", icon: <UserCheck size={20} /> },
    { name: "Package", key: "package", icon: <Heart size={20} /> },
    { name: "Messages", key: "messages", icon: <MessageSquare size={20} /> },
    { name: "Meetings", key: "meetings", icon: <Calendar size={20} /> },
    { name: "Company", key: "company", icon: <Building2 size={20} /> },
    { name: "Settings", key: "settings", icon: <Settings size={20} /> },
    { name: "Logout", key: "logout", icon: <LogOut size={20} /> },
  ];


  const handleNavClick = (key) => {
    if (key === "logout") {
      logout();
    } else {
      setActiveTab(key);
    }
    // Close mobile sidebar after navigation
    setIsMobileOpen(false);
  };

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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="mobile-menu-btn fixed top-4 left-4 z-[60] lg:hidden bg-[var(--primary-color)] text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar
        ${isCollapsed ? 'w-16' : 'w-64'} 
        bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 
        fixed left-0 top-0 z-50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Img src={'/logo.webp'} />
          </div>

          {/* Desktop collapse button */}
          <span
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="cursor-pointer hidden lg:flex items-center justify-center p-2 rounded-lg transition-colors"
          >
            <FaArrowLeft className={`text-gray-600 hover:text-[var(--primary-color)] transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </span>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`${isCollapsed ? 'flex-1 px-2' : 'flex-1 px-7'} py-4`}>
          <ul className="space-y-1">
            {navLinks.map((item) => (
              <li key={item.key}>
                <span
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-3xl text-left transition-colors cursor-pointer ${activeTab === item.key
                    ? 'bg-[var(--accent-color)] text-[var(--primary-color)]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
