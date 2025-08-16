import { Link } from "react-router-dom";
import Emblem from "../assets/Emblem.jpg";
import MotherImage from "../assets/splashscreen.jpg";

export default function SplashScreen() {
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

      {/* Language Buttons */}
      <div className="flex flex-col justify-center w-full gap-3 mt-5 sm:flex-row sm:w-auto">
        <button className="bg-[#7b0000] text-white rounded-lg px-3 py-2 w-full sm:w-[110px] md:w-[130px] h-[55px] text-sm sm:text-sm md:text-base leading-tight">
          ආයුබෝවන් <br />
          <span className="text-[8px] sm:text-xs font-normal">
            සිංහලෙන් බලන්න
          </span>
        </button>
        <button className="bg-[#7b0000] text-white rounded-lg px-3 py-2 w-full sm:w-[110px] md:w-[130px] h-[55px] text-sm sm:text-sm md:text-base leading-tight">
          வணக்கம் <br />
          <span className="text-[8px] sm:text-xs font-normal">
            சிங்கலத்தில் பாருங்கள்
          </span>
        </button>
        <Link to={`/loadingscreen`}>
          <button className="bg-[#7b0000] text-white rounded-lg px-3 py-2 w-full sm:w-[110px] md:w-[130px] h-[55px] text-sm sm:text-sm md:text-base leading-tight">
            WELCOME <br />
            <span className="text-[8px] sm:text-xs font-normal">
              VIEW IN ENGLISH
            </span>
          </button>
        </Link>
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
