import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [profileScore, setProfileScore] = useState(0)

  axios.defaults.withCredentials = true;

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      console.log("User data response:", data);

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
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
        setUserData(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(false);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileScore = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/checkprofilescore`);
      if (data.success) {
        setProfileScore(data.profileScore);
      } else {
        setProfileScore(0)
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // ✅ Only one effect
  useEffect(() => {
    const init = async () => {
      await getUserState();
      await checkProfileScore();
    };
    init();
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
    checkProfileScore,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};