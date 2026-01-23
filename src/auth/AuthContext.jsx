import api from "@/api/axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userAuth, setUserAuth] = useState(null);
  const [userAuthLoading, setUserAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Called after successful login
   */
  const login = (userData) => {
    setUserAuth(userData);
  };

  /**
   * Logout = clear backend session + memory
   */
  const logout = async () => {
    try {
      const url = "/auth/logout";
      await api.post(url);
    } catch (e) {
      // ignore backend failure
    } finally {
      setUserAuth(null);
    }
  };

  /**
   * LogoutAll = clear backend session for all logins for this user + memory
   */
  const logoutAll = async () => {
    try {
      const url = "/auth/logoutAll";
      await api.post(url);
    } catch (e) {
      // ignore backend failure
    } finally {
      setUserAuth(null);
    }
  };

  /**
   * Restore session on page refresh
   */
  const loadUser = async () => {
    setUserAuthLoading(true);
    try {
      const url = "/api/users/auth";
      const res = await api.get(url);
      console.log("Load User success");
      setUserAuth(res.data);
      setIsAuthenticated(true); // { email, phoneNumber, firstName, lastName, roles }
    } catch (error) {
      console.log("AuthContext Load user error", error);
      setUserAuth(null);
      //toast.error("Unauthorized");
      // console.log("Logging out");
      //logout();
    } finally {
      setUserAuthLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const refreshAuth = () => {
    console.log("refreshing auth");
    loadUser();
  };

  useEffect(() => {
    if (!userAuthLoading) {
      if (userAuth && userAuth?.email?.length > 0) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [userAuth]);

  const hasRole = (role) => userAuth?.roles?.includes(role);

  return (
    <AuthContext.Provider
      value={{
        userAuth,
        roles: userAuth?.roles || [],
        isAuthenticated,
        hasRole,
        userAuthLoading,
        login,
        logout,
        logoutAll,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Safe hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
