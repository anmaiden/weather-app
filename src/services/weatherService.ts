import axios from 'axios';
import { Weather } from '../types/WeatherData';

export const API_KEY = '1d6b8231b26621e893050bef9a4b49e2';

export const getCurrentWeather = async (
  city: string,
  language?: string,
): Promise<Weather> => {
  const currentLanguage = window.localStorage.getItem('language'); //get a lang from localStorage
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=${currentLanguage}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

export const getCurrentWeatherByLocation = async (
    lat: number,
    lon: number,
    currentLanguage: string | null
  ) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=${currentLanguage}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };
