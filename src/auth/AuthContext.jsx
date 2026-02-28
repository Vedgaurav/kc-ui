import api from "@/api/axios";
import { Spinner } from "@/components/ui/spinner";
import { API_URL } from "@/constants/Constants";
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
    loadUser();
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

  const refreshUser = async () => {
    setUserAuthLoading(true);
    try {
      const url = `${API_URL}/auth/refresh`;
      await api.post(url);
      await loadUser();
    } catch (error) {
      console.log("AuthContext Load user error", error);
    } finally {
      setUserAuthLoading(false);
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
      setIsAuthenticated(true);
    } catch (error) {
      console.log("AuthContext Load user error", error);
      setUserAuth(null);
    } finally {
      setUserAuthLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const refreshAuth = async () => {
    console.log("refreshing auth");
    await refreshUser();
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
  const hasAnyRole = (...roles) =>
    roles.some((role) => userAuth?.roles?.includes(role));

  return (
    <AuthContext.Provider
      value={{
        userAuth,
        roles: userAuth?.roles || [],
        isAuthenticated,
        hasRole,
        hasAnyRole,
        userAuthLoading,
        login,
        logout,
        logoutAll,
        refreshAuth,
      }}
    >
      {userAuthLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
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
