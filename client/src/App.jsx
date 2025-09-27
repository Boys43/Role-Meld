import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { toast, ToastContainer } from 'react-toastify';
import JobDetails from './pages/JobDetails'
import Dashboard from './pages/Dashboard'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from './context/AppContext'
import AdminDashboard from './pages/AdminDashboard'
import axios from 'axios'
import FindJobs from './pages/FindJobs'
import CategoryJobs from './pages/CategoryJobs'
import BlogsDetails from './pages/BlogsDetails'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loading from './components/Loading'
import EditBlog from './pages/EditBlog'

const AdminRoute = () => {
  const { isLoggedIn, userData } = useContext(AppContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  } else {
    if (userData.isAdmin) {
      return children;
    } else {
      toast.error("You are not authorized to access this page");
      <Navigate to="/dashboard" replace />;
    }
  }
};

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);
  
  if (!isLoggedIn) {
    toast.error("Please Login First")
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/jobdetails/:id" element={<JobDetails />} />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/editblog" element={
          <AdminRoute>
            <EditBlog />
          </AdminRoute>
        } />
        <Route path="/find-jobs" element={<FindJobs />} />
        <Route path="/category-jobs" element={<CategoryJobs />} />
        <Route path="/blogdetails/:slug" element={<BlogsDetails />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
