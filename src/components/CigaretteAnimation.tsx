
import React from 'react';
import { getCigaretteEquivalence } from '@/utils/aqi';

interface CigaretteAnimationProps {
  aqi: number;
  pm25: number;
}

const CigaretteAnimation: React.FC<CigaretteAnimationProps> = ({ aqi, pm25 }) => {
  const cigaretteCount = getCigaretteEquivalence(pm25);
  // Cap at 10 cigarettes for display purposes, but show the actual count in text
  const displayCount = Math.min(10, Math.ceil(cigaretteCount));
  
  return (
    <div className="w-full max-w-md mx-auto mb-10 animate-fade-in">
      <div className="text-lg font-medium mb-2">
        Breathing This Air Is Like Smoking
      </div>
      
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center flex-wrap gap-2 my-4">
          {Array.from({ length: displayCount }).map((_, index) => (
            <div key={index} className="relative">
              <Cigarette />
            </div>
          ))}
        </div>
        
        <div className="text-3xl font-bold mt-2">
          {cigaretteCount.toFixed(1)} <span className="text-xl">cigarettes daily</span>
        </div>
        
        <div className="text-sm text-muted-foreground mt-2 max-w-sm">
          Based on the PM2.5 level of {pm25.toFixed(1)} μg/m³, breathing this air for 24 hours 
          is equivalent to smoking {cigaretteCount.toFixed(1)} cigarettes.
        </div>
      </div>
    </div>
  );
};

// Single cigarette component
const Cigarette: React.FC = () => {
  return (
    <div className="flex items-center h-7 transform rotate-12">
      {/* Filter */}
      <div className="w-8 h-7 bg-gradient-to-r from-orange-200 to-orange-300 rounded-l-sm border border-gray-300">
        {/* Filter details */}
        <div className="h-full w-full overflow-hidden relative">
          <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-orange-100 opacity-30"></div>
          <div className="absolute left-2 top-1 bottom-1 w-[1px] bg-orange-100 opacity-30"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-400"></div>
        </div>
      </div>
      
      {/* Cigarette body */}
      <div className="w-16 h-6 bg-white border border-gray-300 rounded-r-sm relative">
        {/* Paper texture */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-grow h-full border-r border-gray-100 last:border-r-0" 
              style={{ width: `${100/8}%` }}
            ></div>
          ))}
        </div>
        
        {/* Tobacco texture */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-amber-800"
              style={{ 
                width: `${1 + Math.random()}px`, 
                height: `${1 + Math.random()}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CigaretteAnimation;
