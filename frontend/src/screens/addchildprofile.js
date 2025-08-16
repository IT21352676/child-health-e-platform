import React, { useState } from 'react';
import { Menu, Camera, User } from 'lucide-react';
import Header from '../components/header';

const AddChildProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    dateOfBirth: '',
    gender: '',
    birthWeightHeight: '',
    bloodGroup: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>
      {/* Main Content */}
      <div className="p-4 pt-20">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h1 className="mb-8 text-2xl font-bold text-red-800">Add Child Profile</h1>
          
          {/* Profile Photo Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-40 h-40 bg-gray-300 border-4 border-red-800 rounded-full">
                <User className="w-20 h-20 text-white" />
              </div>
              <div className="absolute flex items-center justify-center w-12 h-12 transition-colors bg-red-800 rounded-full cursor-pointer bottom-2 right-2 hover:bg-red-900">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Nickname (optional)
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-800"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Birth Weight & Height */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Birth Weight & Height (optional)
              </label>
              <input
                type="text"
                name="birthWeightHeight"
                value={formData.birthWeightHeight}
                onChange={handleInputChange}
                placeholder="e.g., 3.2kg, 50cm"
                className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>

            {/* Blood Group */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-200 border-none rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-800"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full px-12 py-4 font-medium text-white transition-colors bg-red-800 rounded-lg md:w-auto hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChildProfile;