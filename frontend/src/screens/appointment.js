import React, { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import Header from "../components/header";

// Simple Calendar Component (since react-date-range isn't available)
function SimpleCalendar({ selectedDate, onChange }) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDate.getDate() === day;
    days.push(
      <button
        key={day}
        onClick={() => onChange(new Date(year, month, day))}
        className={`p-2 text-sm rounded ${
          isSelected 
            ? 'bg-[#6a0d0d] text-white' 
            : 'hover:bg-gray-100'
        }`}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className="p-4">
      <div className="text-xl mb-4 text-center font-semibold text-[#6a0d0d]">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-xs font-semibold text-center text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("pending");

  const pendingAppointments = [
    { type: "Doctor Channeling", date: "20 Aug 2025", time: "10:00 AM" },
    { type: "Vaccine 1st Dose", date: "25 Aug 2025", time: "9:30 AM" },
  ];

  const completedAppointments = [
    { type: "Doctor Channeling", date: "05 Aug 2025", time: "10:00 AM" },
    { type: "Vaccine Channeling", date: "10 Aug 2025", time: "16:00 AM" },
  ];

  const vaccineHistory = [
    { name: "MMR 1st Dose", date: "9 Sep 2025" },
    { name: "BCG", date: "9 Sep 2025" },
    { name: "Hepatitis B", date: "9 Sep 2025" },
    { name: "MMR 2nd Dose", date: "9 Sep 2025" },
    { name: "Polio", date: "9 Sep 2025" },
    { name: "DTP", date: "9 Sep 2025" },
  ];

  return (
    <div>
      <Header/>
      
      {/* Main content with top padding to account for fixed header */}
      <div className="max-w-3xl mx-auto pt-24 p-4 bg-[#FFF8F8] min-h-screen">  
        {/* Make Appointment */}
        <h2 className="text-xl font-bold mb-3 text-[#6a0d0d]">
          Make Appointment
        </h2>
        <div className="p-4 bg-white shadow-md rounded-xl">
          <SimpleCalendar
            selectedDate={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
          <div className="flex gap-4 mt-4">
            <button className="bg-[#6a0d0d] text-white px-5 py-3 rounded-full hover:bg-[#5a0a0a] transition-colors text-sm">
              Book Channeling
            </button>
            <button className="bg-[#6a0d0d] text-white px-5 py-3 rounded-full hover:bg-[#5a0a0a] transition-colors text-sm">
              Book Vaccination
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-8 border-b border-gray-300">
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              activeTab === "pending"
                ? "text-[#6a0d0d] border-b-2 border-[#6a0d0d]"
                : "text-gray-500 hover:text-[#6a0d0d]"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              activeTab === "completed"
                ? "text-[#6a0d0d] border-b-2 border-[#6a0d0d]"
                : "text-gray-500 hover:text-[#6a0d0d]"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              activeTab === "vaccine"
                ? "text-[#6a0d0d] border-b-2 border-[#6a0d0d]"
                : "text-gray-500 hover:text-[#6a0d0d]"
            }`}
            onClick={() => setActiveTab("vaccine")}
          >
            Vaccinations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "pending" && (
          <div className="grid gap-4 mt-4">
            {pendingAppointments.map((appt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-[#6a0d0d]">{appt.type}</p>
                  <p className="text-sm text-gray-500">
                    {appt.date} - {appt.time}
                  </p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="grid gap-4 mt-4">
            {completedAppointments.map((appt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-[#6a0d0d]">{appt.type}</p>
                  <p className="text-sm text-gray-500">
                    {appt.date} - {appt.time}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "vaccine" && (
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3">
            {vaccineHistory.map((vaccine, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
              >
                <p className="font-semibold text-[#6a0d0d]">{vaccine.name}</p>
                <p className="text-sm text-gray-500">Date: {vaccine.date}</p>
                <span className="px-2 py-1 mt-2 text-xs text-green-600 bg-green-100 rounded-full w-fit">
                  Completed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}