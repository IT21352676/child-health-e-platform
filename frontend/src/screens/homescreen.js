import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "../components/header";
import Child1 from "../assets/Child.jpg";

const user = JSON.parse(localStorage.getItem("user"));

const childrenData = [
  {
    name: "K A W Sithuki Amandi",
    age: "2Y 3M",
    nextVaccine: "DTP - SEP 20",
    status: "Healthy",
    profileImage:
      "https://i.pinimg.com/736x/52/7a/15/527a1580f7e7eafa793c005e645d06cd.jpg",
    height: 48,
    weight: 24,
    chartData: [18, 24, 23, 22, 26, 25, 28],
    healthPlans: [
      { type: "Vaccination", title: "MMR 1st Dose" },
      { type: "Channeling", title: "Monthly Weight Check-up" },
      { type: "Channeling", title: "Monthly Height Check-up" },
    ],
  },
  {
    name: "P U W Tharusha Perera",
    age: "3Y 0M",
    nextVaccine: "Polio - OCT 10",
    status: "Healthy",
    profileImage:
      "https://media.istockphoto.com/id/911983386/photo/portrait-of-a-happy-little-girl-laughing-and-smiling.jpg?s=612x612&w=0&k=20&c=3lA0ouSyQQHow2ZutUM2zlIloVRKJ69i9ohA1WbCeBc=",
    height: 50,
    weight: 26,
    chartData: [20, 22, 24, 23, 25, 27, 29],
    healthPlans: [
      { type: "Channeling", title: "Monthly Height Check-up" },
      { type: "Vaccination", title: "DTP Booster" },
    ],
  },
];

export default function HomePage() {
  console.log(user);
  const [selectedChild, setSelectedChild] = useState(childrenData[0]);

  const chartData = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "2025",
        data: selectedChild.chartData,
        fill: true,
        backgroundColor: "rgba(153, 27, 27, 0.1)",
        borderColor: "#991B1B",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#991B1B",
        pointRadius: 5,
      },
    ],
  };

  return (
    <div>
      <Header />

      <div className="max-w-3xl mx-auto p-4 bg-[#FFF8F8] min-h-screen">
        {/* Child Profile */}
        <h2 className="text-xl font-bold text-[#7B1E1E] mb-2 mt-[80px]">
          Child Profile
        </h2>
        <div className="flex overflow-hidden bg-white shadow-md rounded-2xl">
          {/* Left side - Details (2/3) */}
          <div className="w-2/3 p-4">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Name
            </label>
            <select
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B1E1E] focus:border-transparent bg-white mb-4"
              value={selectedChild.name}
              onChange={(e) =>
                setSelectedChild(
                  childrenData.find((c) => c.name === e.target.value)
                )
              }
            >
              {childrenData.map((child) => (
                <option key={child.name} value={child.name}>
                  {child.name}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 min-w-[80px]">
                  Age:
                </span>
                <span className="text-sm text-gray-800">
                  {selectedChild.age}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 min-w-[80px]">
                  Next Vaccine:
                </span>
                <span className="text-sm text-gray-800">
                  {selectedChild.nextVaccine}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 min-w-[80px]">
                  Status:
                </span>
                <span className="text-sm font-medium text-green-600">
                  {selectedChild.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Image (1/3) */}
          <div className="flex-shrink-0 w-1/3">
            <img
              src={selectedChild.profileImage}
              alt="child profile"
              className="object-cover w-full h-full min-h-[160px] border-l border-gray-200"
            />
          </div>
        </div>

        {/* Height & Weight */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 p-4 text-center bg-white shadow-md rounded-2xl">
            <p className="text-sm font-medium text-gray-600">Current Height</p>
            <p className="text-3xl font-bold text-[#7B1E1E] mt-2">
              {selectedChild.height} CM
            </p>
            <p className="mt-2 text-xs font-medium text-green-600">
              8% Growth in last month
            </p>
          </div>
          <div className="flex-1 p-4 text-center bg-white shadow-md rounded-2xl">
            <p className="text-sm font-medium text-gray-600">Current Weight</p>
            <p className="text-3xl font-bold text-[#7B1E1E] mt-2">
              {selectedChild.weight} KG
            </p>
            <p className="mt-2 text-xs text-gray-400">Normal range</p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="p-4 mt-4 bg-white shadow-md rounded-2xl">
          <h2 className="mb-4 text-lg font-bold text-[#7B1E1E]">
            Growth Chart
          </h2>
          <div className="h-56">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: {
                      color: "rgba(0,0,0,0.1)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Health Plans */}
        <div className="mt-4">
          <h2 className="mb-2 text-lg font-bold text-[#7B1E1E]">
            This Week’s Health Plans
          </h2>
          <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-hide">
            {selectedChild.healthPlans.map((plan, idx) => (
              <div
                key={idx}
                className="min-w-[220px] bg-white p-4 rounded-2xl shadow-md flex-shrink-0"
              >
                <p className="text-sm text-gray-500">{plan.type}</p>
                <p className="font-bold text-[#7B1E1E]">{plan.title}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Child: {selectedChild.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Guidance / Blogs */}
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-[#7B1E1E]">
            Featured Guidance
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 transition bg-white shadow-md rounded-2xl hover:shadow-lg group"
              >
                <div className="mb-3 overflow-hidden rounded-lg">
                  <img
                    src={`https://placehold.co/300x200?text=Blog+${i}`}
                    alt={`Blog ${i}`}
                    className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-2 text-base font-bold leading-tight text-gray-800">
                  Child Health Guide {i}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-600">
                  Essential tips and guidance for your child's healthy
                  development and growth.
                </p>
                <button className="px-4 py-2 text-sm text-[#7B1E1E] border border-[#7B1E1E] rounded-lg hover:bg-[#7B1E1E] hover:text-white transition-colors duration-200">
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
