
// AQI level definitions
export type AQILevel = 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

// AQI data types based on OpenWeatherMap API
export interface AirPollutionResponse {
  coord: {
    lon: number;
    lat: number;
  };
  list: {
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }[];
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Get AQI level based on the AQI index (1-5)
export const getAQILevel = (aqi: number): AQILevel => {
  switch (aqi) {
    case 1:
      return 'Good';
    case 2:
      return 'Moderate';
    case 3:
      return 'Unhealthy for Sensitive Groups';
    case 4:
      return 'Unhealthy';
    case 5:
      return 'Very Unhealthy';
    default:
      return 'Hazardous';
  }
};

// Get color code based on AQI level
export const getAQIColor = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'aqi-good';
    case 2:
      return 'aqi-moderate';
    case 3:
      return 'aqi-unhealthy';
    case 4:
      return 'aqi-veryunhealthy';
    case 5:
      return 'aqi-hazardous';
    default:
      return 'aqi-hazardous';
  }
};

// Get Tailwind color class based on AQI level
export const getAQIColorClass = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'text-aqi-good';
    case 2:
      return 'text-aqi-moderate';
    case 3:
      return 'text-aqi-unhealthy';
    case 4:
      return 'text-aqi-veryunhealthy';
    case 5:
      return 'text-aqi-hazardous';
    default:
      return 'text-aqi-hazardous';
  }
};

// Get Tailwind bg color class based on AQI level
export const getAQIBgColorClass = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'bg-aqi-good';
    case 2:
      return 'bg-aqi-moderate';
    case 3:
      return 'bg-aqi-unhealthy';
    case 4:
      return 'bg-aqi-veryunhealthy';
    case 5:
      return 'bg-aqi-hazardous';
    default:
      return 'bg-aqi-hazardous';
  }
};

// Get cigarette equivalence based on PM2.5 levels
export const getCigaretteEquivalence = (pm25: number): number => {
  // Rough estimate: 22 μg/m3 of PM2.5 ≈ 1 cigarette
  return Math.round((pm25 / 22) * 10) / 10;
};

// Get description of health impact based on AQI
export const getHealthImpact = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
    case 2:
      return 'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people.';
    case 3:
      return 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
    case 4:
      return 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
    case 5:
      return 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
    default:
      return 'Health alert: everyone may experience more serious health effects.';
  }
};
