import axios from 'axios';
import { Weather } from '../types/WeatherData';

export const API_KEY = 'b66d6f1fc8d37d319e9b20b2ae41fc28';

export const getCurrentWeather = async (
  city: string,
  language: 'en' | 'ua' | 'ru'
): Promise<Weather> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=${language}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

