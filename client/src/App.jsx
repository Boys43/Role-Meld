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
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import Resume from './pages/Resume'
import FindJobs from './pages/FIndJobs'

// // ----------------//
// //   Auth Context  //
// // ----------------//
// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const { isLoggedIn: appIsLoggedIn, userData } = useContext(AppContext);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Wait for authentication check to complete
//     // appIsLoggedIn is null during initial check, false when not logged in, true when logged in
//     if (appIsLoggedIn !== null) {
//       if (appIsLoggedIn === false || (appIsLoggedIn === true && userData !== false)) {
//         setLoading(false);
//       }
//     }
//   }, [appIsLoggedIn, userData]);

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn: appIsLoggedIn, loading, user: userData }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

const App = () => {

  const { userData } = useContext(AppContext);

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
      </Routes>
      {/* <Footer /> */}
    </>
  )
}

export default App;
