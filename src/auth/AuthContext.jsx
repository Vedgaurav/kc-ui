import { createContext, useContext, useEffect, useState } from "react";
import useSecureAxios from "@/common_components/hooks/useSecureAxios";
import { BASE_URL } from "@/constants/Constants";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const secureAxios = useSecureAxios();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Called after successful login
   */
  const login = (userData) => {
    console.log("AuthContext login");
    setUser(userData);
  };

  /**
   * Logout = clear backend session + memory
   */
  const logout = async () => {
    try {
      const url = BASE_URL + "/auth/logout";
      await secureAxios.post(url);
    } catch (e) {
      // ignore backend failure
    } finally {
      setUser(null);
    }
  };

  /**
   * LogoutAll = clear backend session for all logins for this user + memory
   */
  const logoutAll = async () => {
    try {
      const url = BASE_URL + "/auth/logoutAll";
      await secureAxios.post(url);
    } catch (e) {
      // ignore backend failure
    } finally {
      setUser(null);
    }
  };

  /**
   * Restore session on page refresh
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const url = BASE_URL + "/api/users/auth";
        const res = await secureAxios.get(url);
        setUser(res.data); // { email, phoneNumber, firstName, lastName, roles }
      } catch (error) {
        setUser(null);
        //toast.error("Unauthorized");
        // console.log("Logging out");
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        roles: user?.roles || [],
        isAuthenticated: !!user,
        hasRole,
        loading,
        login,
        logout,
        logoutAll,
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
