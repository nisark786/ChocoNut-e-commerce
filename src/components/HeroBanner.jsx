import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Truck, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";

// Using placeholder images from Picsum with food/chocolate/nuts theme
const images = [
  "https://media.istockphoto.com/id/2186322524/photo/dubai-chocolate-pistachio-paste-and-kunefe-filled-milk-chocolate.webp?a=1&b=1&s=612x612&w=0&k=20&c=a0w9gDhofmoT-f1adwJKeOVEVRWJy4Qm10-Eg4qdr94=",
  "https://images.unsplash.com/photo-1553452118-621e1f860f43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
];

const features = [
  { icon: Star, text: "Premium Quality" },
  { icon: Truck, text: "Free Shipping" },
  { icon: Shield, text: "Quality Guarantee" },
  { icon: Heart, text: "Made with Love" }
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Auto play every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]); // Re-run when currentIndex changes

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-b-3xl shadow-2xl">
      {/* Slides */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Premium Chocolates & Nuts ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black to-orange-800/50"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
         

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Indulge in{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Sweet Perfection
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-amber-100">
            Discover handcrafted chocolates and premium nuts - perfect treats for every occasion. 
            Fresh, delicious, and delivered to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/shops"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-2 text-lg"
            >
              <span>Shop Now</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-amber-100">
                <feature.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20 border border-white/30 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20 border border-white/30 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 flex justify-center w-full space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-amber-400 scale-125" 
                : "bg-white/50 hover:bg-white/70"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}