import React from 'react';
import { Menu } from 'lucide-react';
import Header from '../components/header';

const ChildHealthGuidance = () => {
  const guidanceCards = [
    {
      id: 1,
      image: "/api/placeholder/400/250",
      title: "Signs of Breastfeeding Success in the First Month",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      alt: "Mother breastfeeding baby"
    },
    {
      id: 2,
      image: "/api/placeholder/400/250",
      title: "The Link Between Feeding Habits and Weight Gain",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      alt: "Baby being weighed on scale"
    },
    {
      id: 3,
      image: "/api/placeholder/400/250",
      title: "Starting Solid Foods: A Month-by-Month Guide",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      alt: "Mother feeding baby solid food"
    },
    {
      id: 4,
      image: "/api/placeholder/400/250",
      title: "How Much Sleep Does a Baby Need by Age?",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      alt: "Sleeping baby"
    },
    {
      id: 5,
      image: "/api/placeholder/400/250",
      title: "Your Baby's First Year: Milestones",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      alt: "Baby milestone photo"
    },
    {
      id: 6,
      image: "/api/placeholder/400/250",
      title: "The Ultimate Guide to Baby Vaccinations",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      alt: "Baby getting vaccination"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="p-4 pt-24">
        <h1 className="text-xl font-bold mb-4 text-[#6a0d0d]">
          Featured Guidance
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:gap-8 max-w-7xl">
          {guidanceCards.map((card) => (
            <div 
              key={card.id} 
              className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={card.image}
                  alt={card.alt}
                  className="object-cover w-full h-48 transition-transform duration-300 md:h-56 lg:h-64 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100"></div>
              </div>
              
              <div className="p-5 md:p-6">
                <h3 className="mb-3 text-lg font-bold leading-tight text-gray-800 transition-colors duration-200 md:text-xl group-hover:text-pink-600">
                  {card.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
                  {card.description}
                </p>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-pink-600 transition-all duration-200 bg-white border border-pink-500 rounded-lg hover:bg-pink-500 hover:text-white">
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom spacing for mobile */}
        <div className="h-8"></div>
      </main>
    </div>
  );
};

export default ChildHealthGuidance;