
import React from 'react';
import { 
  AirPollutionResponse, 
  GeocodingResponse, 
  getAQILevel, 
  getAQIColorClass,
  getHealthImpact,
  getCigaretteEquivalence
} from '@/utils/aqi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AQIDisplayProps {
  pollutionData: AirPollutionResponse | null;
  city: GeocodingResponse | null;
  isLoading: boolean;
}

const AQIDisplay: React.FC<AQIDisplayProps> = ({ pollutionData, city, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto aqi-card animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
        <div className="h-24 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (!pollutionData || !city || pollutionData.list.length === 0) {
    return null;
  }

  const aqiData = pollutionData.list[0];
  const aqiValue = aqiData.main.aqi;
  const aqiLevel = getAQILevel(aqiValue);
  const colorClass = getAQIColorClass(aqiValue);
  const healthImpact = getHealthImpact(aqiValue);
  const pm25 = aqiData.components.pm2_5;
  const cigaretteEquivalent = getCigaretteEquivalence(pm25);

  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-fade-in">
      <Card className="aqi-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-medium">
            Air Quality in {city.name}, {city.country}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            {/* Display PM2.5 as the primary metric */}
            <div className={`text-7xl font-bold mb-2 ${colorClass}`}>
              {pm25.toFixed(1)}
            </div>
            <div className="text-xl font-medium">
              PM2.5 (μg/m³)
            </div>
            <div className={`text-lg font-medium mt-2 ${colorClass}`}>
              {aqiLevel}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-6 text-left">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">AQI Index</span>
              <span className="text-xl font-medium">{aqiValue} / 5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">PM10</span>
              <span className="text-xl font-medium">{aqiData.components.pm10.toFixed(1)} μg/m³</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">O3 (Ozone)</span>
              <span className="text-xl font-medium">{aqiData.components.o3.toFixed(1)} μg/m³</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">NO2</span>
              <span className="text-xl font-medium">{aqiData.components.no2.toFixed(1)} μg/m³</span>
            </div>
          </div>
          
          {/* Cigarette equivalence as text only */}
          <div className="w-full max-w-md mx-auto mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-lg font-medium mb-2">
              Health Impact
            </div>
            <div className="text-2xl font-bold mb-2">
              = {cigaretteEquivalent.toFixed(1)} cigarettes daily
            </div>
            <div className="text-sm text-muted-foreground">
              Breathing this air for 24 hours is equivalent to smoking {cigaretteEquivalent.toFixed(1)} cigarettes.
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground text-left">
            <p>{healthImpact}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AQIDisplay;
