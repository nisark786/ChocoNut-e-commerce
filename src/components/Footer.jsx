// src/components/Footer.jsx
import { Facebook, Twitter, Instagram, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-amber-900 to-amber-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Icons */}
          <div className="flex space-x-6">
            <a
              href="#"
              className="w-10 h-10 bg-amber-800/50 rounded-full flex items-center justify-center hover:bg-amber-700 transition-all duration-200 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-amber-300" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-amber-800/50 rounded-full flex items-center justify-center hover:bg-amber-700 transition-all duration-200 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-amber-300" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-amber-800/50 rounded-full flex items-center justify-center hover:bg-amber-700 transition-all duration-200 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-amber-300" />
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center space-x-2 text-amber-300/80 text-sm">
            <span>&copy; {currentYear} ChocoNut</span>
            <span>•</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>for chocolate lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}