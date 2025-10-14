import axios from "axios";
import { createContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileScore, setProfileScore] = useState(0);
  const [jobId, setJobId] = useState("");
  const [savedJobs, setSavedJobs] = useState(() => new Set());

  axios.defaults.withCredentials = true;

  const sendNotification = async (user, subject, type) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/notifications/send`, {
        subject,
        user,
        type
      });

      if (data.success) {
        console.log("Notification sent successfully:", data.notification);
      } else {
        console.log("Failed to send notification:", data.message);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };


  // Example toggleSaveJob
  const toggleSaveJob = async (id) => {
    if (!isLoggedIn) {
      return toast.error("Please Login to Save Jobs");
    }

    try {
      setSavedJobs((prev) => {
        const newSavedJobs = new Set(prev);

        if (newSavedJobs.has(id)) {
          newSavedJobs.delete(id);
          toast.success("Job Unsaved");
        } else {
          newSavedJobs.add(id);
          toast.success("Job Saved");
        }

        // return updated state
        return newSavedJobs;
      });

      // get latest version after state update
      const updatedSavedJobs = new Set(savedJobs);
      if (updatedSavedJobs.has(id)) {
        updatedSavedJobs.delete(id);
      } else {
        updatedSavedJobs.add(id);
      }

      // Sync with backend
      await axios.post(`${backendUrl}/api/user/savejob`, {
        savedJobs: Array.from(updatedSavedJobs),
      });

    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };


  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.profile);

        if (Array.isArray(data.profile.savedJobs)) {
          setSavedJobs(new Set(data.profile.savedJobs));
        }

        if (data.profile.role === "user") {
          setProfileScore(data.profile.profileScore);
        }
      } else {
        setUserData(null);
      }
    } catch {
      setUserData(null);
    }
  }



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
    } catch {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserState();
  }, []);

  const value = useMemo(() => ({
    frontendUrl,
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
    toggleSaveJob,
    sendNotification
  }), [
    frontendUrl,
    backendUrl,
    isLoggedIn,
    userData,
    profileScore,
    loading,
    jobId,
    savedJobs
  ]);

  return (
    <AppContext.Provider value={value}>
      {loading ? <Loading /> : props.children}
    </AppContext.Provider>
  );
};