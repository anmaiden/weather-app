import React, { useState } from "react";
import "./CitySearch.css";
import { getCurrentWeather } from "../../services/weatherService";
import { Weather } from "../../types/WeatherData";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrentWeatherCard";

const CitySearch: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherCards, setWeatherCards] = useState<Weather[]>([]);

  const handleSearch = async () => {
    try {
      const weatherData = await getCurrentWeather(city, "en");
      setWeatherCards((prevWeatherCards) => [...prevWeatherCards, weatherData]);
      setCity("");
    } catch (error) {
      console.error("Error retrieving weather data. Please try again.", error);
    }
  };

  const handleClose = (index: number) => {
    setWeatherCards((prevWeatherCards) => {
      const updatedCards = [...prevWeatherCards];
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
    <div>
      <input
        type="text"
        className="search-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a city name"
      />
      <button onClick={handleSearch} className="search-btn">
        Add
      </button>

      <div className="weather-cards-container">
        {weatherCards.map((weatherData, index) => (
          <CurrentWeatherCard
            key={index}
            weather={weatherData}
            handleClose={() => handleClose(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CitySearch;