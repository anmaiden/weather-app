import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Weather } from '../types/WeatherData';


// language settings saved in localStorage
  const savedLanguage = localStorage.getItem('language');

interface WeatherState {
  currentWeather: Weather | null;
  cities: string[];
  temperatureUnit: 'C' | 'F';
  language: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  cities: [],
  temperatureUnit: 'C',
  language: savedLanguage ? savedLanguage : 'en',
};
  

  const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentWeather: (state, action: PayloadAction<Weather>) => {
      state.currentWeather = action.payload;
    },
    addCity: (state, action: PayloadAction<string>) => {
      state.cities.push(action.payload);
    },
    setTemperatureUnit: (state, action: PayloadAction<'C' | 'F'>) => {
      state.temperatureUnit = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ua' | 'ru'>) => {
      state.language = action.payload;
    },
  },
});

export const {
  setCurrentWeather,
  addCity,
  setTemperatureUnit,
  setLanguage,
} = weatherSlice.actions;

export default weatherSlice.reducer;