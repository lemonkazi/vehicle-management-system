'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleSlider({ vehicles }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % vehicles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [vehicles.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % vehicles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      
        No vehicles to display
      
    );
  }

  return (
    
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={vehicle.vehicle_pic || '/images/placeholder.jpg'}
            alt={`Vehicle ${vehicle.id}`}
            fill
            className="object-cover"
          />
          
            
              
                {vehicle.vehicle_type?.name}
              
              {vehicle.vehicle_location}
            
          
        
      ))}

      
        
      

      
        
      

      
        {vehicles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      
    
  );
}