
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  initialState,
  type ActivityEntry,
  type Credentials,
  type FoodEntry,
  type User,
} from "../types";

import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";

// Create Context
const AppContext = createContext(initialState);

export const AppProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const navigate = useNavigate();

  // States
  const [user, setUser] = useState<User | null>(null);

  const [isUserFetch, setUserFetch] = useState(false);

  const [onboardingCompleted, setOnboardingCompleted] =
    useState(false);

  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);

  const [allActivityLogs, setAllActivityLogs] =
    useState<ActivityEntry[]>([]);

  // Signup
  const signup = async (credentials: Credentials) => {
    const { data } = await mockApi.auth.register(credentials);

    setUser({ ...data.user, token: data.jwt });

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
  };

  // Login
  const login = async (credentials: Credentials) => {
    const { data } = await mockApi.auth.login(credentials);

    setUser({ ...data.user, token: data.jwt });

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
  };

  // Fetch User
  const fetchUser = async (token: string) => {
    try {
      const { data } = await mockApi.user.me();

      setUser({ ...data, token });

      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }
    } finally {
      setUserFetch(true);
    }
  };

  // Fetch Food Logs
  const fetchFoodLogs = async () => {
    const { data } = await mockApi.foodLogs.list();

    setAllFoodLogs(data);
  };

  // Fetch Activity Logs
  const fetchActivityLogs = async () => {
    const { data } = await mockApi.activityLogs.list();

    setAllActivityLogs(data);
  };

  // Check Authentication
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      (async () => {
        try {
          await fetchUser(token);
          await fetchFoodLogs();
          await fetchActivityLogs();
        } catch (error) {
          console.error("Authentication error:", error);
          logout();
        }
      })();
    } else {
      setUserFetch(true);
    }
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    setOnboardingCompleted(false);

    navigate("/");
  };

  // Context Values
  const value = {
    user,
    setUser,

    isUserFetch,

    signup,
    login,
    logout,

    onboardingCompleted,
    setOnboardingCompleted,

    allFoodLogs,
    allActivityLogs,

    setAllFoodLogs,
    setAllActivityLogs,

    fetchUser,
    fetchFoodLogs,
    fetchActivityLogs,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => useContext(AppContext);
