
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AirPollutionResponse, GeocodingResponse } from '@/utils/aqi';
import { toast } from "sonner";

// Using the correct OpenWeatherMap API key
const API_KEY = "7f8f91312d5384be468834134937b7e3";

const fetchCityCoordinates = async (cityName: string): Promise<GeocodingResponse | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Geocoding API Error:', errorData);
      throw new Error(`Failed to fetch city coordinates: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json() as GeocodingResponse[];
    
    if (data.length === 0) {
      toast.error(`City "${cityName}" not found`);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    toast.error('Error fetching city coordinates. Please try again.');
    return null;
  }
};

const fetchAirPollution = async (lat: number, lon: number): Promise<AirPollutionResponse | null> => {
  try {
    console.log(`Fetching AQI data for coordinates: ${lat}, ${lon}`);
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error('Air Pollution API Response:', response);
      throw new Error(`Failed to fetch air pollution data: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Received AQI data:", data);
    
    return data as AirPollutionResponse;
  } catch (error) {
    console.error('Error fetching air pollution data:', error);
    toast.error('Error fetching air quality data. Please try again.');
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
