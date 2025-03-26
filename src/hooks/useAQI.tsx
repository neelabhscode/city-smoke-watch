
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AirPollutionResponse, GeocodingResponse } from '@/utils/aqi';
import { toast } from "sonner";

// We'll use a free API service from AirVisual API by IQAir
const API_KEY = "c47aab41-4cb8-4add-b1df-9ff8ae09f1ad"; // This is a demo API key for IQAir

const fetchCityCoordinates = async (cityName: string): Promise<GeocodingResponse | null> => {
  try {
    // Using a more reliable geocoding service
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=7f8f91312d5384be468834134937b7e3`
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
    // Using the IQAir API for air quality data instead
    console.log(`Fetching AQI data for coordinates: ${lat}, ${lon}`);
    
    // Fallback implementation using a direct CORS-enabled API
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=18a918fabb7d0b13f5cb1d38250ab535a12469d1`
    );
    
    if (!response.ok) {
      console.error('Air Pollution API Response:', response);
      throw new Error(`Failed to fetch air pollution data: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Received AQI data:", data);
    
    // Transform WAQI API response to our expected format
    if (data.status === "ok") {
      // Map the WAQI data format to our application's expected format
      const transformedData: AirPollutionResponse = {
        coord: {
          lon: lon,
          lat: lat
        },
        list: [{
          main: {
            aqi: data.data.aqi > 300 ? 5 : 
                 data.data.aqi > 200 ? 4 : 
                 data.data.aqi > 100 ? 3 : 
                 data.data.aqi > 50 ? 2 : 1
          },
          components: {
            co: data.data.iaqi.co?.v || 0,
            no: data.data.iaqi.no?.v || 0,
            no2: data.data.iaqi.no2?.v || 0,
            o3: data.data.iaqi.o3?.v || 0,
            so2: data.data.iaqi.so2?.v || 0,
            pm2_5: data.data.iaqi.pm25?.v || 0,
            pm10: data.data.iaqi.pm10?.v || 0,
            nh3: 0 // Not available in this API
          },
          dt: Math.floor(Date.now() / 1000)
        }]
      };
      
      return transformedData;
    } else {
      throw new Error("AQI data not available for this location");
    }
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
