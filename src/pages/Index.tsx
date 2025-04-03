
import React from 'react';
import CitySearch from '@/components/CitySearch';
import AQIDisplay from '@/components/AQIDisplay';
import { useAQI } from '@/hooks/useAQI';
import { Toaster } from "sonner";

const Index = () => {
  const { 
    searchCity, 
    pollutionData, 
    selectedCity, 
    isLoadingCoordinates,
    isLoadingPollution
  } = useAQI();

  const isLoading = isLoadingCoordinates || isLoadingPollution;
  const hasData = pollutionData && selectedCity && pollutionData.list.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 md:p-12">
      <Toaster position="top-center" />
      
      <header className="w-full max-w-4xl mx-auto text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">City Smoke Watch</h1>
        <p className="text-lg text-muted-foreground">
          Check the air quality in any city and see its cigarette equivalent
        </p>
      </header>
      
      <main className="w-full max-w-4xl mx-auto flex-grow">
        <CitySearch onSearch={searchCity} isLoading={isLoading} />
        
        {hasData && (
          <AQIDisplay 
            pollutionData={pollutionData} 
            city={selectedCity} 
            isLoading={isLoading} 
          />
        )}
        
        {!hasData && !isLoading && (
          <div className="text-center text-muted-foreground mt-20 animate-fade-in">
            <p className="text-xl">Enter a city name to check air quality</p>
          </div>
        )}
      </main>
      
      <footer className="w-full max-w-4xl mx-auto text-center mt-12 text-sm text-muted-foreground">
        <p>
          Data provided by OpenWeatherMap API • 
          Air quality information for educational purposes only
        </p>
      </footer>
    </div>
  );
};

export default Index;
