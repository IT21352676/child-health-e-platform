import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Emblem from "../assets/Emblem.jpg";
import Background from "../assets/background.jpg";

const apiURL = process.env.REACT_APP_API_URL;

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Email and password required !", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
    try {
      const res = await axios.post(`${apiURL}/user-auth/user-login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(`Login Success, Welcome!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setTimeout(() => {
        window.location.href = "/homescreen";
      }, 2000);
    } catch (err) {
      return toast.error(`${err.response.data.message} !`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-center bg-cover"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="w-full max-w-md p-8 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full">
              <img className="mb-4" src={Emblem} alt="img" />
            </div>
          </div>

          <div className="mt-2 mb-2">
            <p className="text-xs text-gray-600">දරුවන්ගේ සෞඛ්‍ය වර්ධන සටහන</p>
            <p className="text-xs text-gray-600">
              குழந்தை சுகாதார மேம்பாட்டு பதிவு
            </p>
            <p className="text-xs text-gray-600">
              CHILD HEALTH DEVELOPMENT RECORD
            </p>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-red-800">Sign In</h2>
        </div>

        <div className="space-y-6">
          {/* Email/Phone Input */}
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email/Phone Number"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-gray-700 placeholder-gray-500 transition-colors border-2 border-red-300 rounded-lg bg-white/70 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-4 pr-12 text-gray-700 placeholder-gray-500 transition-colors border-2 border-red-300 rounded-lg bg-white/70 focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 font-semibold text-white transition-colors duration-200 transform bg-red-800 rounded-lg hover:bg-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            Log In
            {/* <Link to="/homescreen">Log In</Link> */}
          </button>

          {/* Switch to Sign Up */}
          <div className="text-center">
            <span className="text-gray-700">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-gray-900 underline transition-colors hover:text-red-600"
              >
                Sign Up
              </a>
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
