import React from 'react';
import { Menu } from 'lucide-react';
import Header from '../components/header';

const ChildHealthRecord = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="p-4 pt-20">
        {/* Child Information Header */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-red-800">K A W Sithuki Amandi</h1>
          
          <div className="flex flex-col space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
            {/* Profile Photo */}
            <div className="flex justify-center md:justify-start">
              <div className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
                <img 
                  src="https://www.babycentre.co.uk/ims/2019/11/iStock-1010051606_4x3.jpg"
                  alt="Child photo placeholder"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            {/* Child Details */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600">Full Name</span>
                  <span className="font-medium text-gray-900 sm:block">Sithuki Amandi</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium text-gray-900 sm:block">2y 3m</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium text-gray-900 sm:block">Male</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600">Blood Group</span>
                  <span className="font-medium text-gray-900 sm:block">O+</span>
                </div>
                <div className="flex justify-between sm:block sm:col-span-2">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="font-medium text-gray-900 sm:block">2023/08/26</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Vaccinations Section */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-red-800">Recent Vaccinations</h2>
          
          <div className="space-y-4">
            {/* Vaccine 1 - MMR */}
            <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="absolute w-16 h-16 right-4 top-4 opacity-20">
                <div className="flex items-center justify-center w-full rounded-full h-ful">
                  
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-1 text-xs font-medium text-blue-600">Vaccine 01</div>
                <h3 className="mb-3 text-lg font-bold text-red-800">Measles, Mumps, and Rubella</h3>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium text-gray-900">2024/05/06</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Dose</div>
                    <div className="font-medium text-gray-900">2024/09/05</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vaccine 2 - DTaP */}
            <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="absolute w-16 h-16 right-4 top-4 opacity-20">
                <div className="flex items-center justify-center w-full h-full rounded-full">
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-1 text-xs font-medium text-green-600">Vaccine 02</div>
                <h3 className="mb-3 text-lg font-bold text-red-800">DTaP Booster</h3>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium text-gray-900">2024/08/08</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Dose</div>
                    <div className="font-medium text-gray-900">2025/02/05</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vaccine 3 - Polio */}
            <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-lg">
              <div className="absolute w-16 h-16 right-4 top-4 opacity-20">
                <div className="flex items-center justify-center w-full h-full rounded-full">
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-1 text-xs font-medium text-red-600">Vaccine 03</div>
                <h3 className="mb-3 text-lg font-bold text-red-800">Polio (IPV) Booster</h3>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium text-gray-900">2025/01/08</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Dose</div>
                    <div className="font-medium text-gray-900">2025/07/08</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildHealthRecord;