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
    removeWeatherCard: (state, action: PayloadAction<string>) => {
      const index = state.weatherCards.findIndex(c => c.id === action.payload);
      if (index !== -1) {
        state.weatherCards[index].isOpen = !state.weatherCards[index].isOpen;
      }
    },
    addWeatherCard: (state, action: PayloadAction<Weather>) => {
      const id = state.weatherCards.length ? (parseInt(state.weatherCards[state.weatherCards.length - 1].id) + 1).toString() : "0";
      state.weatherCards.push({ id, isOpen: true, data: action.payload });
    },
  },
});

export const {
  setCurrentWeather,
  addCity,
  setTemperatureUnit,
  setLanguage,
  removeWeatherCard,
  addWeatherCard,
} = weatherSlice.actions;

export default weatherSlice.reducer;