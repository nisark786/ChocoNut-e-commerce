// src/components/Alert.jsx
import { useEffect } from "react";

export default function Alert({ message, type = "error", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto close after 2s
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fadeIn">
      {message}
    </div>
  );
}
