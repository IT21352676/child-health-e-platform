import React from 'react';
import { Menu, Camera, Plus, QrCode } from 'lucide-react';
import Header from '../components/header';
import { Link, Links } from 'react-router-dom';

const ParentProfile = () => {
  const children = [
    {
      id: 1,
      name: "K A W Sithuki Amandi",
      age: "2Y 3M",
      nextVaccine: "DTP - SEP 20",
      status: "Healthy",
      statusColor: "text-green-500",
      statusDot: "bg-green-500",
      image: "https://i.pinimg.com/736x/52/7a/15/527a1580f7e7eafa793c005e645d06cd.jpg"
    },
    {
      id: 2,
      name: "P U W Tharusha Perera",
      age: "2Y 3M",
      nextVaccine: "DTP - SEP 20",
      status: "Need More Attention",
      statusColor: "text-orange-500",
      statusDot: "bg-orange-500",
      image: "https://media.istockphoto.com/id/911983386/photo/portrait-of-a-happy-little-girl-laughing-and-smiling.jpg?s=612x612&w=0&k=20&c=3lA0ouSyQQHow2ZutUM2zlIloVRKJ69i9ohA1WbCeBc="
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
        
      <Header/>

      {/* Main Content */}
      <main className="max-w-6xl p-4 pt-24 mx-auto md:p-6 lg:p-8">
        <h1 className="mb-8 text-2xl font-bold text-red-800 md:text-3xl lg:text-4xl">Parent Profile</h1>

        {/* Parent Information Section */}
        <div className="p-4 mb-8 bg-white shadow-lg rounded-2xl md:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Profile Picture */}
            <div className="flex justify-center flex-shrink-0 lg:justify-start">
              <div className="relative">
                <div className="w-32 h-32 overflow-hidden border-4 border-red-800 rounded-full md:w-40 md:h-40 lg:w-48 lg:h-48">
                  <img 
                    src="https://placehold.co/200x200?text=Parent"
                    alt="Parent Profile" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 transition-colors bg-red-800 rounded-full hover:bg-red-700 lg:w-12 lg:h-12">
                  <Camera className="w-5 h-5 text-white lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            {/* Parent Details */}
            <div className="flex-1 space-y-4 lg:space-y-6">
              {/* Mobile Layout - Stack */}
              <div className="space-y-4 md:hidden">
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Full Name</span>
                  <p className="font-medium text-red-800">Hasini Fernando</p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Contact Number</span>
                  <p className="font-medium text-red-800">+94 77 88 96 478</p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Email</span>
                  <p className="font-medium text-red-800 break-all">hasini458@gmail.com</p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Relationship</span>
                  <p className="font-medium text-red-800">Mother</p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Address</span>
                  <p className="font-medium text-red-800">No: 58, Cuba road, Colombo</p>
                </div>
              </div>

              {/* Tablet & Desktop Layout - Grid */}
              <div className="hidden space-y-4 md:block lg:space-y-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                  <div className="flex">
                    <span className="flex-shrink-0 font-semibold text-gray-700 w-36 lg:w-40">Full Name</span>
                    <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                    <span className="font-medium text-red-800">Hasini Fernando</span>
                  </div>
                  
                  <div className="flex">
                    <span className="flex-shrink-0 font-semibold text-gray-700 w-36 lg:w-40">Contact Number</span>
                    <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                    <span className="font-medium text-red-800">+94 77 88 96 478</span>
                  </div>
                  
                  <div className="flex">
                    <span className="flex-shrink-0 font-semibold text-gray-700 w-36 lg:w-40">Email</span>
                    <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                    <span className="font-medium text-red-800 break-all lg:break-normal">hasini458@gmail.com</span>
                  </div>
                  
                  <div className="flex">
                    <span className="flex-shrink-0 font-semibold text-gray-700 w-36 lg:w-40">Relationship</span>
                    <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                    <span className="font-medium text-red-800">Mother</span>
                  </div>
                </div>
                
                <div className="flex">
                  <span className="flex-shrink-0 font-semibold text-gray-700 w-36 lg:w-40">Address</span>
                  <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                  <span className="font-medium text-red-800">No: 58, Cuba road, Colombo</span>
                </div>
              </div>

              <div className="pt-4 lg:pt-6">
                <button className="w-full px-6 py-2 font-medium text-white transition-colors bg-red-800 rounded-lg md:w-auto hover:bg-red-700 lg:px-8 lg:py-3">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="space-y-6 lg:space-y-8">
          {children.map((child, index) => (
            <div key={child.id} className="overflow-hidden bg-white shadow-lg rounded-2xl">
              <div className="flex flex-col lg:flex-row">
                {/* Child Info */}
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                  <div className="mb-4 lg:mb-6">
                    <h3 className="mb-2 text-base font-bold text-red-800 lg:text-lg">Child {String(index + 1).padStart(2, '0')}</h3>
                    <h2 className="mb-4 text-lg font-bold text-red-800 md:text-xl lg:text-2xl">{child.name}</h2>
                  </div>

                  {/* Mobile Layout - Stack */}
                  <div className="mb-6 space-y-3 md:hidden">
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-700">Age</span>
                      <p className="font-medium text-gray-800">{child.age}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-700">Next Vaccine</span>
                      <p className="font-medium text-gray-800">{child.nextVaccine}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-gray-700">Status</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${child.statusDot}`}></div>
                        <span className={`font-medium ${child.statusColor}`}>{child.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tablet & Desktop Layout - Aligned */}
                  <div className="hidden mb-6 space-y-3 md:block lg:space-y-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-32 font-semibold text-gray-700 lg:w-36">Age</span>
                      <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                      <span className="font-medium text-gray-800">{child.age}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-32 font-semibold text-gray-700 lg:w-36">Next Vaccine</span>
                      <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                      <span className="font-medium text-gray-800">{child.nextVaccine}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-32 font-semibold text-gray-700 lg:w-36">Status</span>
                      <span className="flex-shrink-0 mr-4 text-gray-600">:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${child.statusDot}`}></div>
                        <span className={`font-medium ${child.statusColor}`}>{child.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <button className="w-full px-6 py-2 font-medium text-white transition-colors bg-red-800 rounded-lg sm:w-auto hover:bg-red-700 lg:px-8 lg:py-3">
                     <Link to="/childprofile">View Profile</Link>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 transition-colors border-2 border-red-800 rounded-lg hover:bg-red-50 lg:w-12 lg:h-12">
                      <QrCode className="w-5 h-5 text-red-800 lg:w-6 lg:h-6" />
                    </button>
                  </div>
                </div>

                {/* Child Photo */}
                <div className="relative h-48 md:h-56 lg:w-80 lg:h-auto">
                  <img 
                    src={child.image}
                    alt={child.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Child Button */}
        <div className="flex justify-center mt-8 lg:mt-12">
          <button className="flex items-center gap-2 px-6 py-3 font-medium text-red-800 transition-colors border-2 border-red-800 rounded-lg hover:bg-red-800 hover:text-white lg:px-8 lg:py-4">
            <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
            <Link to="/addchildprofile">Add Child</Link>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ParentProfile;