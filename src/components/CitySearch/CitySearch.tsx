import React, { useEffect, useState } from "react";
import "./CitySearch.css";
import { withTranslation } from "react-i18next";
import { API_KEY, getCurrentWeather } from "../../services/weatherService";
import { Weather } from "../../types/WeatherData";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrentWeatherCard";
import axios from "axios";

interface CitySearchProps {
  t: (key: string) => string;
}

const CitySearch: React.FC<CitySearchProps> = ({ t }) => {
  const [city, setCity] = useState("");
  const [weatherCards, setWeatherCards] = useState<Weather[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const weatherData = await getCurrentWeather(city, "en");
      const id = Date.now().toString(); // uniq id
      setWeatherCards((prevWeatherCards) => [
        ...prevWeatherCards,
        { ...weatherData, id },
      ]); // add id for card
      setCity("");
      setError(null);
    } catch (error) {
      console.error("Error retrieving weather data. Please try again.", error);
      setError("Error retrieving weather data. Please try again.");
    }
  };

  //////////////////////////
  //Location weather

  const [locationWeather, setLocationWeather] = useState<Weather | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // check if geolocation is supported/enabled on current browser
      navigator.geolocation.getCurrentPosition(function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getCurrentWeatherByLatLng(lat, lon);
      });
    }
  }, []);

  const getCurrentWeatherByLatLng = async (lat: number, lon: number) => {
    const currentLanguage = window.localStorage.getItem("language"); //get a lang from localStorage
    try {
      const weatherData = await getCurrentWeatherByLocation(
        lat,
        lon,
        currentLanguage
      );
      if (
        !weatherCards.find((cityWeather) => cityWeather.id === weatherData.id)
      ) {
        setLocationWeather(weatherData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentWeatherByLocation = async (
    lat: number,
    lon: number,
    currentLanguage: string | null
  ) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=${currentLanguage}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  if (
    locationWeather &&
    !weatherCards.find((cityWeather) => cityWeather.id === locationWeather.id)
  ) {
    setWeatherCards([locationWeather, ...weatherCards]);
  }

  //////////////////////

  const handleClose = (id: string) => {
    setWeatherCards((prevWeatherCards) => {
      const updatedCards = [...prevWeatherCards];
      const index = updatedCards.findIndex((card) => card.id === id); // find id
      updatedCards.splice(index, 1);
      return updatedCards;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={t("placeholder")}
      />
      <button onClick={handleSearch} className="search-btn">
        {t("add")}
      </button>
      {error && <p className="error-message">{t("error")}</p>}
      <div className="weather-cards-container">
        {weatherCards.map((weatherData, index) => (
          <CurrentWeatherCard
            language="en"
            key={weatherData.id}
            weather={weatherData}
            handleClose={() => handleClose(weatherData.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default withTranslation()(CitySearch);
