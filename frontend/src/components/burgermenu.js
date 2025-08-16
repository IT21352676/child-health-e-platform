import React from "react";
import { X, Home, CalendarCheck, Activity, FileText, User, LogOut } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BurgerMenu({ open, onClose }) {

  const handleLogout = () => {
    // Show a modern toast notification
    toast.success("You have been logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

    // Redirect after a short delay (optional)
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#7B1E1E]/95 shadow-lg transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-white">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col h-full px-6 mt-4 ml-4 space-y-4 text-white">
          <a href="/homescreen" className="flex items-center gap-3 py-4 hover:text-gray-300">
            <Home size={20} /> Home
          </a>
          <a href="/appointments" className="flex items-center gap-3 py-4 hover:text-gray-300">
            <CalendarCheck size={20} /> Appointments
          </a>
          <a href="/growthscreen" className="flex items-center gap-3 py-4 hover:text-gray-300">
            <Activity size={20} /> Growth Chart
          </a>
          <a href="/blogs" className="flex items-center gap-3 py-4 hover:text-gray-300">
            <FileText size={20} /> Blogs
          </a>
          <a href="/profile" className="flex items-center gap-3 py-4 hover:text-gray-300">
            <User size={20} /> Profile
          </a>

          {/* Modern Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-4 hover:text-gray-300"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
}
