// src/context/AuthContext.jsx
import { createContext, useContext } from "react";
import { UserContext } from "./UserContext";

const AuthContext = createContext();

export function AuthProvider({ children }){
  const { setCurrentUser } = useContext(UserContext);

  function login(user){
    setCurrentUser(user);
  };

  function logout(){
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);   //cutomm hook to call in components simple
