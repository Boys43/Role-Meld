import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
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

const AdminRoute = () => {
  const { backendUrl } = useContext(AppContext);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/check-admin`);
        if (data.success) {
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [backendUrl]);

  if (loading) return <p>Loading...</p>;

  if (isAdmin) {
    return <AdminDashboard />;
  } else {
    toast.error("Access Denied - Admins Only");
    return <Dashboard />;
  }
};


const App = () => {

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobdetails/:id" element={<JobDetails />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/find-jobs" element={<FindJobs />} />

      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App;
