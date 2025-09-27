// src/pages/Profile.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [joinedDate, setJoinedDate] = useState("");

  // Set join date on first load
  useEffect(() => {
    if (!currentUser) return;

    if (!currentUser.joinDate) {
      const updatedUser = { ...currentUser, joinDate: new Date().toISOString() };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setJoinedDate(new Date(updatedUser.joinDate).toLocaleDateString());
    } else {
      setJoinedDate(new Date(currentUser.joinDate).toLocaleDateString());
    }
  }, [currentUser, setCurrentUser]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold mb-4">Please login to view your profile.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    );
  }

  const firstLetter = currentUser.name ? currentUser.name[0].toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <section className="max-w-lg mx-auto px-6 py-12 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        {/* Circle avatar */}
        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl font-bold mb-6">
          {firstLetter}
        </div>

        <h2 className="text-2xl font-bold mb-2">{currentUser.name}</h2>
        <p className="text-gray-600 mb-1">User ID: {currentUser.id}</p>
        <p className="text-gray-600 mb-1">Email: {currentUser.email}</p>
        <p className="text-gray-600 mb-6">Joined on: {joinedDate}</p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            View Orders
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
