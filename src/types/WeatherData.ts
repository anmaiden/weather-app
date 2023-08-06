export interface Weather {
  name: string;
  id: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<WeatherDescription>;
  wind: Wind;
  sys: Sys;
}

export interface WeatherDescription {
  description: string;
  icon: string;
} 

export interface Wind {
  speed: number;
  deg: number;
}

export interface Sys {
  country: string;
}