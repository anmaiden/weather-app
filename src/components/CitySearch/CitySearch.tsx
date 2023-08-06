import React, { useState } from "react";
import "./CitySearch.css";
import { withTranslation } from "react-i18next";
import { getCurrentWeather } from "../../services/weatherService";
import { Weather } from "../../types/WeatherData";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrentWeatherCard";

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
