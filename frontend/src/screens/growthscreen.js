import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "../components/header";

export default function GrowthChartScreen() {
  // Chart.js data configuration
  const chartData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: '2025',
        data: [18, 24, 22, 26, 25, 28],
        borderColor: '#6a0d0d',
        backgroundColor: 'rgba(239, 154, 154, 0.3)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6a0d0d',
        pointBorderColor: '#6a0d0d',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#e0e0e0',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      },
      y: {
        min: 0,
        max: 30,
        grid: {
          color: '#e0e0e0',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Height and weight records data
  const healthRecords = [
    { date: "2025/08/09", height: "25cm", weight: "20kg", bmi: "26" },
    { date: "2025/08/10", height: "32cm", weight: "24kg", bmi: "27" },
    { date: "2025/08/11", height: "32cm", weight: "22kg", bmi: "24" },
    { date: "2025/08/12", height: "35cm", weight: "26kg", bmi: "27" },
    { date: "2025/08/13", height: "37cm", weight: "24kg", bmi: "28" }
  ];

  return (
    <div className="max-w-4xl min-h-screen mx-auto font-sans bg-gray-50">
      <Header />
      
      {/* Main content with top padding to account for fixed header */}
      <div className="p-4 pt-24">
        {/* Growth Chart Section */}
        <h2 className="text-xl font-bold mb-4 text-[#6a0d0d]">
          Growth Chart
        </h2>
        
        <div className="p-4 mb-6 bg-white shadow-md rounded-xl">
          <div className="w-full h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Height And Weight Records Section */}
        <h2 className="text-xl font-bold mb-4 text-[#6a0d0d]">
          Height And Weight Records
        </h2>
        
        {/* Card Grid Layout for All Screen Sizes */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {healthRecords.map((record, idx) => (
            <div key={idx} className="p-4 transition-shadow bg-white shadow-md rounded-xl hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-[#6a0d0d] rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{idx + 1}</span>
                </div>
                <span className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                  Record
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#6a0d0d]">Date:</span>
                  <span className="text-sm font-medium text-gray-700">{record.date}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#6a0d0d]">Height:</span>
                  <span className="text-sm font-medium text-gray-700">{record.height}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#6a0d0d]">Weight:</span>
                  <span className="text-sm font-medium text-gray-700">{record.weight}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm font-semibold text-[#6a0d0d]">BMI:</span>
                  <span className="text-sm text-white bg-[#6a0d0d] px-2 py-1 rounded-full font-medium">
                    {record.bmi}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}