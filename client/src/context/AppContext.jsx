import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [profileScore, setProfileScore] = useState(0);
  const [jobId, setJobId] = useState("");
  const [savedJobs, setSavedJobs] = useState(() => new Set());
  axios.defaults.withCredentials = true;

  const toggleSaveJob = async (id) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
        toast.success("Job Unsaved");
      } else {
        newSet.add(id);
        toast.success("Job Saved");
      }

      // Backend call
      const arrJobs = Array.from(newSet);
      axios.post(`${backendUrl}/api/user/savejob`, { savedJobs: arrJobs })
        .catch((error) => {
          toast.error(error.message || "Something went wrong");
        });

      return newSet;
    });
  };


  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.profile);

        // ✅ Sync savedJobs state with backend
        if (Array.isArray(data.profile.savedJobs)) {
          setSavedJobs(new Set(data.profile.savedJobs));
        }

        if (data.profile.role === "user")
          setProfileScore(data.profile.profileScore);
      } else {
        setUserData(false);
      }
    } catch (error) {
      setUserData(false);
    }
  };

  const getUserState = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getUserState,
    profileScore,
    loading,
    jobId,
    setJobId,
    savedJobs,
    setSavedJobs,
    toggleSaveJob
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div
            className="w-16 h-16 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
      ) : (
        props.children
      )}
    </AppContext.Provider>
  );
};