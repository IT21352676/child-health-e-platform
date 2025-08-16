import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Emblem from "../assets/Emblem.jpg";
import MotherImage from "../assets/splashscreen.jpg";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (progress < 100) {
      timer = setTimeout(() => {
        setProgress((prev) => prev + 2); // Increase speed here
      }, 40);
    } else {
      navigate("/signin");
    }
    return () => clearTimeout(timer);
  }, [progress, navigate]);

  return (
    <div className="flex flex-col items-center text-center min-h-screen bg-gradient-to-b from-white to-[#fdf7f7] px-4 py-5">
      {/* Government Logo */}
      <img
        src={Emblem}
        alt="Government Logo"
        className="w-20 mt-3 sm:w-24 md:w-28"
      />

      {/* Title Section */}
      <div className="mt-3 space-y-1">
        <h2 className="text-sm sm:text-base">දරුගේ සෞඛ්‍ය වර්ධන සටහන</h2>
        <h2 className="text-sm sm:text-base">
          குழந்தை சுகாதார மேம்பாட்டு பதிவு
        </h2>
        <h2 className="text-sm font-bold sm:text-base">
          CHILD HEALTH DEVELOPMENT RECORD
        </h2>
      </div>

      {/* Loading bar */}
      <div className="w-full h-2 max-w-md mt-8 mb-8 overflow-hidden bg-gray-200 rounded-full">
        <div
          className="h-full bg-[#7b0000] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mother & Baby Image */}
      <div className="flex justify-center w-full mt-5">
        <img
          src={MotherImage}
          alt="Mother and Baby"
          className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] object-contain"
        />
      </div>
    </div>
  );
}
