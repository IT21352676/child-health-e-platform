
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Emblem from "../assets/Emblem.jpg"
import Background from "../assets/background.jpg"
import { Link } from 'react-router-dom';

export default function SelectDepartment() {
  const [formData, setFormData] = useState({
    selectdepartment: '',
  });
  

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
              <img className="mb-4" src={Emblem}/>
            </div>
          </div>
          
          <div className="mt-2 mb-2">
            <p className="text-xs text-gray-600">දරුවන්ගේ සෞඛ්‍ය වර්ධන සටහන</p>
            <p className="text-xs text-gray-600">குழந்தை சுகாதார மேம்பாட்டு பதிவு</p>
            <p className="text-xs text-gray-600">CHILD HEALTH DEVELOPMENT RECORD</p>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-red-800">Select Department</h2>

        </div>

        <div className="space-y-6">

          {/* Full Name Input */}
          <div>
            <select className='w-[280px]'>
                <option value="nationalbudget">Department of National Budget</option>
                <option value="nationalbudget">Department of Health</option>
                <option value="nationalbudget">Department of Co-operative Development</option>
                <option value="nationalbudget">Department of the Registrar of Companies</option>
                <option value="nationalbudget">Department of Transportation</option>

            </select>
          </div>

          {/* Submit Button */}
          <button
         
            className="w-full py-4 font-semibold text-white transition-colors duration-200 transform bg-red-800 rounded-lg hover:bg-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100">
            <Link to="/splashscreen">Submit</Link>
          </button>
          
        </div>
      </div>
    </div>
  );
}