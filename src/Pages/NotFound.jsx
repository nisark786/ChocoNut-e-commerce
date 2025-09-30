// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Home, ShoppingBag, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <div className="text-6xl font-bold text-amber-600">404</div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-100 rounded-full opacity-50"></div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Page Not Found</h1>
        <p className="text-amber-700 mb-8 text-lg leading-relaxed">
          Oops! It seems like this page has melted away like chocolate in the sun. 
          Let's get you back to something sweet!
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>

          <Link
            to="/shops"
            className="border border-amber-300 text-amber-700 py-3 px-6 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Go Shopping</span>
          </Link>
        </div>

        {/* Quick Tips */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center justify-center space-x-2">
            <Search className="w-5 h-5 text-amber-600" />
            <span>Quick Tips</span>
          </h3>
          <ul className="text-amber-700 text-sm space-y-2">
            <li>• Check the URL for typos</li>
            <li>• Use the navigation menu above</li>
            <li>• Browse our delicious products</li>
            <li>• Contact us if you need help</li>
          </ul>
        </div>

      </div>
    </div>
  );
}