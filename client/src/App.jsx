import { Routes, Route, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useContext, useEffect, useState, Suspense, lazy } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useGlobalLazyImages from "./hooks/useGlobalLazyImages";

import { AppContext } from "./context/AppContext";
import Loading from "./components/Loading";

// Lazy-loaded components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const ChatBotBubble = lazy(() => import("./components/ChatBotBubble"));

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const FindJobs = lazy(() => import("./pages/FindJobs"));
const CategoryJobs = lazy(() => import("./pages/CategoryJobs"));
const BlogsDetails = lazy(() => import("./pages/BlogsDetails"));
const EditBlog = lazy(() => import("./pages/EditBlog"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));

// 🔒 Admin-only route
export const AdminRoute = ({ children }) => {
  const { backendUrl, isLoggedIn } = useContext(AppContext);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const checkAdmin = async () => {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/auth/check-admin`,
            { withCredentials: true }
          );
          setIsAdmin(data.isAdmin);
        } catch (err) {
          setIsAdmin(false);
          toast.error("Failed to verify admin status");
        }
      };
      checkAdmin();
    }
  }, [isLoggedIn, backendUrl]);

  if (!isLoggedIn) {
    toast.error("Please Login First");
    return <Navigate to="/login" replace />;
  }

  if (isAdmin === null) {
    return <Loading />;
  }

  if (isAdmin) {
    return children;
  } else {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/dashboard" replace />;
  }
};

// 🔐 Protected route
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);

  if (!isLoggedIn) {
    toast.error("Please Login First");
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 🌍 Main App
const App = () => {
  useGlobalLazyImages();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (

    <>
      <ToastContainer />
      <Suspense fallback={<Loading />}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/jobdetails/:id" element={<JobDetails />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/editblog"
            element={
              <AdminRoute>
                <EditBlog />
              </AdminRoute>
            }
          />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/find-jobs" element={<FindJobs />} />
          <Route path="/category-jobs" element={<CategoryJobs />} />
          <Route path="/blogdetails/:slug" element={<BlogsDetails />} />
        </Routes>
        <ChatBotBubble />
        <Footer />
      </Suspense>
    </>
  );
};

export default App;