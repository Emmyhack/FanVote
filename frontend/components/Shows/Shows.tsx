import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Users, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedShows = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const shows = [
    {
      id: "bb-naija-2024",
      title: "Big Brother Naija 2024",
      description: "Vote for your favorite housemate and shape the game. Experience the ultimate reality TV voting experience with blockchain transparency.",
      image: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=600&h=700&fit=crop",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      category: "Reality TV",
      viewers: "2.5M",
      status: "Live Now",
      rating: "4.8"
    },
    {
      id: "survivor-legends",
      title: "Survivor: Legends",
      description: "Support your favorite castaway on their ultimate journey. Strategic gameplay meets survival in this epic competition.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=700&fit=crop",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
      category: "Competition",
      viewers: "1.8M",
      status: "Live Now",
      rating: "4.9"
    },
    {
      id: "the-circle-influencers",
      title: "The Circle: Influencers",
      description: "Choose the ultimate influencer in this game of social strategy. Digital manipulation meets real connections.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=700&fit=crop",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
      category: "Social Strategy",
      viewers: "1.2M",
      status: "Live Now",
      rating: "4.7"
    },
    {
      id: "dancing-stars",
      title: "Dancing with the Stars",
      description: "Vote for your favorite celebrity and professional dancer duo. Grace, talent, and entertainment collide.",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&h=700&fit=crop",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      category: "Entertainment",
      viewers: "3.1M",
      status: "Coming Soon",
      rating: "4.6"
    },
    {
      id: "masterchef-finale",
      title: "MasterChef Season Finale",
      description: "Support your favorite home cook in the final battle for the MasterChef title. Culinary excellence meets voting power.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=700&fit=crop",
      bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600",
      category: "Cooking",
      viewers: "1.5M",
      status: "Live Now",
      rating: "4.8"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % shows.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + shows.length) % shows.length);
  };

  const visibleShows = shows.slice(currentIndex, currentIndex + 3);

  return (
    <section className="bg-slate-900 py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Featured Shows
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Discover the most popular voting campaigns and make your voice heard in entertainment history.
            </p>
          </div>
          
          {/* Enhanced Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={prevSlide}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-all duration-300 rounded-full border border-slate-700 hover:border-slate-600"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-all duration-300 rounded-full border border-slate-700 hover:border-slate-600"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Enhanced Shows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleShows.map((show) => (
            <Link key={show.id} href={`/campaign/${show.id}`} className="group">
              <div className="bg-slate-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20 border border-slate-700 hover:border-slate-600">
                {/* Enhanced Image Section */}
                <div className={`relative h-80 ${show.bgColor} flex items-center justify-center overflow-hidden`}>
                  <Image 
                    src={show.image} 
                    alt={show.title}
                    width={600}
                    height={700}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay with Play Button */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      show.status === 'Live Now' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-black'
                    }`}>
                      {show.status}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {show.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black bg-opacity-60 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{show.rating}</span>
                  </div>
                </div>
                
                {/* Enhanced Content */}
                <div className="p-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {show.title}
                  </h3>
                  <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-4 line-clamp-2">
                    {show.description}
                  </p>

                  {/* Enhanced Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{show.viewers} viewers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Vote Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="mt-16 text-center">
          <Link href="/campaigns">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1">
              <Play className="w-5 h-5" />
              View All Campaigns
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShows;