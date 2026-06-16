import { createContext, useContext, useMemo, useState } from "react";
import { USERS } from "../data/users.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("etik-mail-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState("");

  const login = (email, password) => {
    const found = USERS.find(
      (item) => item.email === email.trim() && item.password === password
    );

    if (!found) {
      setError("E-posta veya şifre hatalı.");
      return false;
    }

    const sessionUser = {
      email: found.email,
      name: found.name,
      initials: found.initials,
    };
    setUser(sessionUser);
    localStorage.setItem("etik-mail-user", JSON.stringify(sessionUser));
    setError("");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("etik-mail-user");
    setError("");
  };

  const value = useMemo(
    () => ({ user, error, login, logout, setError }),
    [user, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth AuthProvider içinde kullanılmalı.");
  return context;
}
