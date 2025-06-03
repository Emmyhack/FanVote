import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedShows = () => {
  const shows = [
    {
      id: 1,
      title: "Big Brother Naija",
      description: "Vote for your favorite housemate and shape the game",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
      bgColor: "bg-emerald-500"
    },
    {
      id: 2,
      title: "Survivor",
      description: "Support your favorite castaway on their ultimate journey",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
      bgColor: "bg-teal-600",
      showLogo: true
    },
    {
      id: 3,
      title: "The Circle",
      description: "Choose the ultimate influencer in this game of social strategy",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop&crop=face",
      bgColor: "bg-amber-500",
      showLogo: true
    }
  ];

  return (
    <section className="bg-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Featured Shows
          </h2>
          
          {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <ChevronLeft size={24} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Shows Container */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          {shows.map((show) => (
            <div key={show.id} className="flex-1 group cursor-pointer">
              <div className="bg-slate-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                {/* Image Section */}
                <div className={`relative h-80 lg:h-96 ${show.bgColor} flex items-center justify-center`}>
                  <img 
                    src={show.image} 
                    alt={show.title}
                    className="w-full h-full object-cover"
                  />
                  {show.showLogo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg font-bold text-lg">
                        {show.id === 2 ? 'SURVIVOR' : 'THE CIRCLE'}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                    {show.title}
                  </h3>
                  <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
                    {show.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedShows;