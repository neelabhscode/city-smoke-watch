
import React, { useEffect, useRef } from 'react';
import { Cigarette } from "lucide-react";

interface CigaretteAnimationProps {
  aqi: number;
  pm25: number;
}

const CigaretteAnimation: React.FC<CigaretteAnimationProps> = ({ aqi, pm25 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Adjust animation speed based on AQI level
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing smoke particles
    const existingParticles = container.querySelectorAll('.smoke-particle');
    existingParticles.forEach(particle => particle.remove());

    // Create smoke particles
    const smokeInterval = setInterval(() => {
      if (!container) {
        clearInterval(smokeInterval);
        return;
      }

      const particle = document.createElement('div');
      particle.className = 'smoke-particle absolute w-4 h-4 rounded-full bg-gray-200/40 animate-smoke';
      
      // Randomize position slightly
      const randomOffset = Math.random() * 10 - 5;
      particle.style.left = `calc(50% + ${randomOffset}px)`;
      particle.style.bottom = '70%';
      
      container.appendChild(particle);
      
      // Remove particle after animation completes
      setTimeout(() => {
        if (particle.parentNode === container) {
          container.removeChild(particle);
        }
      }, 3000);
    }, 300 / Math.max(1, aqi)); // More frequent for higher AQI
    
    return () => clearInterval(smokeInterval);
  }, [aqi]);

  // Adjust burn rate based on PM2.5 level
  const burnDuration = Math.max(5, 20 - pm25 / 10); // Between 5-20s based on PM2.5

  return (
    <div className="w-full max-w-md mx-auto mb-10 animate-fade-in">
      <div className="text-lg font-medium mb-2">
        Pollution Visualization
      </div>
      <div ref={containerRef} className="relative h-40 flex items-center justify-center">
        {/* Cigarette */}
        <div className="relative w-64 h-10 flex items-center">
          {/* Cigarette filter */}
          <div className="w-16 h-10 bg-orange-200 rounded-l-lg border border-gray-300"></div>
          
          {/* Cigarette body */}
          <div className="relative flex-grow h-8 bg-white border border-gray-300 overflow-hidden">
            {/* Burning part */}
            <div 
              className="absolute top-0 right-0 h-full bg-red-500 animate-burn"
              style={{ animationDuration: `${burnDuration}s` }}
            ></div>
          </div>
          
          {/* Cigarette tip */}
          <div className="w-2 h-8 bg-red-600 rounded-r-sm"></div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Visual representation of air pollution in this area
      </div>
    </div>
  );
};

export default CigaretteAnimation;
