import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useContext(UserContext);
  return currentUser ? children : <Navigate to="/login" replace />;
}
