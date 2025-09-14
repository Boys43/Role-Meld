import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import JobsForm from './pages/JobsForm'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ApplicantDashboard from './pages/ApplicantDashboard'
import { ToastContainer } from 'react-toastify';
import Resume from './pages/Resume'
import FindJobs from './pages/FindJobs'
import JobDetails from './pages/JobDetails'
import SavedJobs from './pages/SavedJobs'

const App = () => {

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs-form" element={<JobsForm />} />
        <Route path="/userdashboard" element={<ApplicantDashboard />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/recruiterdashboard" element={<EmployeeDashboard />} />
        <Route path="/find-jobs" element={<FindJobs />} />
        <Route path="/jobdetails/:id" element={<JobDetails />} />
        <Route path="/savedjobs" element={<SavedJobs />} />
      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App;
