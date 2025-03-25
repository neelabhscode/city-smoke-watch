
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AirPollutionResponse, GeocodingResponse } from '@/utils/aqi';
import { toast } from "sonner";

// Replace with your own OpenWeatherMap API key or use a placeholder for now
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const fetchCityCoordinates = async (cityName: string): Promise<GeocodingResponse | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch city coordinates');
    }
    
    const data = await response.json() as GeocodingResponse[];
    
    if (data.length === 0) {
      toast.error(`City "${cityName}" not found`);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    toast.error('Error fetching city coordinates');
    return null;
  }
};

const fetchAirPollution = async (lat: number, lon: number): Promise<AirPollutionResponse | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch air pollution data');
    }
    
    return await response.json() as AirPollutionResponse;
  } catch (error) {
    console.error('Error fetching air pollution data:', error);
    toast.error('Error fetching air pollution data');
    return null;
  }
};

export function useAQI() {
  const [cityName, setCityName] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<GeocodingResponse | null>(null);

  const coordinatesQuery = useQuery({
    queryKey: ['coordinates', cityName],
    queryFn: () => fetchCityCoordinates(cityName),
    enabled: cityName.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const airPollutionQuery = useQuery({
    queryKey: ['airPollution', selectedCity?.lat, selectedCity?.lon],
    queryFn: () => 
      selectedCity ? fetchAirPollution(selectedCity.lat, selectedCity.lon) : null,
    enabled: !!selectedCity,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const searchCity = async (city: string) => {
    setCityName(city);
    const coords = await fetchCityCoordinates(city);
    setSelectedCity(coords);
  };

  return {
    cityName,
    setCityName,
    selectedCity,
    searchCity,
    isLoadingCoordinates: coordinatesQuery.isLoading,
    isErrorCoordinates: coordinatesQuery.isError,
    isLoadingPollution: airPollutionQuery.isLoading,
    isErrorPollution: airPollutionQuery.isError,
    pollutionData: airPollutionQuery.data,
  };
}
