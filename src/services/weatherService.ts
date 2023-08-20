import axios from 'axios';
import { Weather } from '../types/WeatherData';

export const API_KEY = '1d6b8231b26621e893050bef9a4b49e2';

export const getCurrentWeather = async (lat: number | null, lon: number | null, city: string | null, language: string | null): Promise<Weather> => {
  let url = "";
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=${language}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=${language}&units=metric`;
  }
  const response = await axios.get(url);
  return response.data;
}

