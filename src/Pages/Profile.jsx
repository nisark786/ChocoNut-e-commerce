// src/pages/Profile.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { User, Mail, Calendar, Package, LogOut, Edit3, Shield, Heart } from "lucide-react";

export default function Profile() {
  const { currentUser, setCurrentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [joinedDate, setJoinedDate] = useState("");
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  // Set join date on first load (and sync with backend)
  useEffect(() => {
    if (!currentUser) return;

    if (!currentUser.joinDate) {
      const updatedUser = { ...currentUser, joinDate: new Date().toISOString() };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Sync with JSON server
      fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinDate: updatedUser.joinDate }),
      }).catch(err => console.error("Failed to update joinDate", err));

      setJoinedDate(new Date(updatedUser.joinDate).toLocaleDateString());
    } else {
      setJoinedDate(new Date(currentUser.joinDate).toLocaleDateString());
    }

    // Fetch user stats
    const fetchStats = async () => {
      try {
        const ordersRes = await fetch(`http://localhost:5000/orders?userId=${currentUser.id}`);
        const ordersData = await ordersRes.json();
        const wishlistRes = await fetch(`http://localhost:5000/wishlists/${currentUser.id}`);
        const wishlistData = await wishlistRes.json();
        
        setStats({
          orders: ordersData.length || 0,
          wishlist: wishlistData.items?.length || 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [currentUser, setCurrentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Profile Access</h2>
          <p className="text-amber-700 mb-6">Please login to view your profile and account details.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Login to Continue</span>
          </button>
        </div>
      </div>
    );
  }

  const firstLetter = currentUser.name ? currentUser.name[0].toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-3">My Profile</h1>
          <p className="text-amber-700">Manage your account and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white">{firstLetter}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h2>
                <p className="text-amber-100">ChocoNut Member</p>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-600">Email</p>
                    <p className="font-medium text-amber-900">{currentUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-600">Member Since</p>
                    <p className="font-medium text-amber-900">{joinedDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-amber-600">User ID</p>
                    <p className="font-mono text-sm text-amber-900">{currentUser.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
              <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
                <span>Activity Summary</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-amber-700">Orders Placed</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                    {stats.orders}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded-lg transition-colors">
                  <span className="text-amber-700">Wishlist Items</span>
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm font-medium">
                    {stats.wishlist}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
              <h3 className="font-semibold text-amber-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center space-x-3 p-3 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200 group"
                >
                  <Package className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span>View Order History</span>
                </button>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full flex items-center space-x-3 p-3 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200 group"
                >
                  <Heart className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span>My Wishlist</span>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
       
      </div>
    </div>
  );
}