import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);

  // Thay cho checkLogin() trong home.js: xác thực lại token với server
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api("/auth/me", { token })
      .then(({ ok, data }) => {
        if (ok) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          logout();
        }
      })
      .catch(() => {});
  }, []);

  function login(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
