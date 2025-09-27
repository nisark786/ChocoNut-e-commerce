// src/context/AuthContext.jsx
import { createContext, useContext } from "react";
import { UserContext } from "./UserContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setCurrentUser } = useContext(UserContext);

  const login = (user) => {
    setCurrentUser(user); // saves to localStorage in UserContext
  };

  const logout = () => {
    setCurrentUser(null); // clears localStorage in UserContext
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
