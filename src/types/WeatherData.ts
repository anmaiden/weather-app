export interface Weather {
  name: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<WeatherDescription>;
  wind: Wind;
}

export interface WeatherDescription {
  description: string;
} 

export interface Wind {
  speed: number;
  deg: number;
}