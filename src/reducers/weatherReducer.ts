import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Weather } from '../types/WeatherData';


// language settings saved in localStorage
const savedLanguage = localStorage.getItem('language');

export interface WeatherCard {
  id: string;
  isOpen: boolean;
  data: Weather;
}

export interface WeatherState {
  currentWeather: Weather | null;
  cities: string[];
  temperatureUnit: 'C' | 'F';
  language: string | null;
  weatherCards: WeatherCard[];
}

export const initialState: WeatherState = {
  currentWeather: null,
  cities: [],
  temperatureUnit: 'C',
  language: savedLanguage ? savedLanguage : 'en',
  weatherCards: [],
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<'C' | 'F'>) => {
      state.temperatureUnit = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ua' | 'ru'>) => {
      state.language = action.payload;
    },
    removeWeatherCard: (state, action: PayloadAction<string>) => {
      state.weatherCards = state.weatherCards.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setTemperatureUnit,
  setLanguage,
  removeWeatherCard,
} = weatherSlice.actions;

export default weatherSlice.reducer;