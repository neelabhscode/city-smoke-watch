
import React, { useEffect, useRef } from 'react';

interface CigaretteAnimationProps {
  aqi: number;
  pm25: number;
}

const CigaretteAnimation: React.FC<CigaretteAnimationProps> = ({ aqi, pm25 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cigaretteRef = useRef<HTMLDivElement>(null);

  // Adjust animation speed and intensity based on AQI level
  useEffect(() => {
    const container = containerRef.current;
    const cigarette = cigaretteRef.current;
    if (!container || !cigarette) return;

    // Clear existing smoke particles
    const existingParticles = container.querySelectorAll('.smoke-particle');
    existingParticles.forEach(particle => particle.remove());

    // Get burning tip position for smoke emission
    const getBurningTipPosition = () => {
      if (!cigarette) return { x: 0, y: 0 };
      const rect = cigarette.getBoundingClientRect();
      const burnElement = cigarette.querySelector('.burning-tip');
      
      if (!burnElement) return { x: rect.right, y: rect.top + rect.height / 2 };
      
      const burnRect = burnElement.getBoundingClientRect();
      return { 
        x: burnRect.right - 5, 
        y: burnRect.top + burnRect.height / 2 
      };
    };

    // Create smoke effect
    const intensity = Math.min(10, Math.max(1, aqi)) / 2;
    const smokeInterval = setInterval(() => {
      if (!container || !cigarette) {
        clearInterval(smokeInterval);
        return;
      }

      const tipPosition = getBurningTipPosition();
      const containerRect = container.getBoundingClientRect();
      
      // Create 1-3 particles per emission based on intensity
      const particleCount = Math.max(1, Math.floor(Math.random() * intensity));
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'smoke-particle absolute rounded-full';
        
        // Randomize size based on intensity and position
        const size = 4 + Math.random() * (4 * intensity);
        const opacity = 0.2 + Math.random() * 0.3;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = `rgba(200, 200, 200, ${opacity})`;
        
        // Position relative to container
        const relativeX = tipPosition.x - containerRect.left;
        const relativeY = tipPosition.y - containerRect.top;
        
        // Randomize initial position slightly
        const randomOffsetX = Math.random() * 2 - 1;
        const randomOffsetY = Math.random() * 4 - 2;
        
        particle.style.left = `${relativeX + randomOffsetX}px`;
        particle.style.top = `${relativeY + randomOffsetY}px`;
        
        // Add to container
        container.appendChild(particle);
        
        // Animate smoke particle
        const duration = 2000 + Math.random() * 1000;
        const delay = Math.random() * 100;
        const finalX = relativeX + 30 + Math.random() * 60;
        const finalY = relativeY - 10 - Math.random() * 40;
        const finalSize = size * (1.5 + Math.random() * 1);
        
        // Initial state
        particle.style.transform = 'scale(0.5)';
        particle.style.opacity = '0';
        
        // Start animation after a small delay
        setTimeout(() => {
          particle.style.transition = `all ${duration}ms ease-out`;
          particle.style.transform = `translate(${finalX - relativeX}px, ${finalY - relativeY}px) scale(${finalSize / size})`;
          particle.style.opacity = '0';
        }, delay);
        
        // Remove particle after animation completes
        setTimeout(() => {
          if (particle.parentNode === container) {
            container.removeChild(particle);
          }
        }, duration + delay + 100);
      }
    }, 200 / Math.max(1, intensity)); // More frequent for higher AQI
    
    return () => clearInterval(smokeInterval);
  }, [aqi]);

  // Adjust burn rate based on PM2.5 level
  const burnDuration = Math.max(10, 30 - pm25 / 5); // Between 10-30s based on PM2.5

  return (
    <div className="w-full max-w-md mx-auto mb-10 animate-fade-in">
      <div className="text-lg font-medium mb-2">
        Pollution Visualization
      </div>
      <div ref={containerRef} className="relative h-48 flex items-center justify-center overflow-hidden">
        {/* Cigarette */}
        <div ref={cigaretteRef} className="relative w-72 flex items-center">
          {/* Cigarette filter */}
          <div className="w-20 h-12 bg-gradient-to-r from-orange-200 to-orange-300 rounded-l-lg border border-gray-300 relative z-10">
            {/* Filter details */}
            <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
              <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-orange-100 opacity-30"></div>
              <div className="absolute left-1 top-1 bottom-1 w-[1px] bg-orange-100 opacity-30"></div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-400"></div>
            </div>
          </div>
          
          {/* Cigarette body */}
          <div className="relative flex-grow h-10 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-300 overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-grow h-full border-r border-gray-100 last:border-r-0" 
                  style={{ width: `${100/30}%` }}
                ></div>
              ))}
            </div>
            
            {/* Tobacco texture */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 100 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full bg-amber-800"
                  style={{ 
                    width: `${1 + Math.random() * 2}px`, 
                    height: `${1 + Math.random() * 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Burning part */}
            <div 
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-600 to-orange-500 animate-burn"
              style={{ animationDuration: `${burnDuration}s` }}
            ></div>
            
            {/* Ash layer */}
            <div 
              className="absolute top-0 right-0 h-full bg-gradient-to-r from-transparent to-gray-300 mix-blend-overlay animate-burn"
              style={{ animationDuration: `${burnDuration}s` }}
            ></div>
          </div>
          
          {/* Burning tip */}
          <div className="burning-tip w-2 h-10 flex flex-col items-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-r-sm z-0"></div>
            <div className="absolute inset-0 rounded-r-sm z-10 overflow-hidden">
              {/* Ember glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-red-500 to-red-800 opacity-70 animate-pulse"></div>
              
              {/* Ember particles */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-yellow-200"
                  style={{
                    width: `${1 + Math.random() * 2}px`,
                    height: `${1 + Math.random() * 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.7 + Math.random() * 0.3,
                    animation: `pulse ${1 + Math.random() * 2}s infinite alternate`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Visual representation of air pollution in this area
      </div>
    </div>
  );
};

export default CigaretteAnimation;
