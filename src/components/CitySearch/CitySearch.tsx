import React, { useState } from "react";
import "./CitySearch.css";
import { getCurrentWeather } from "../../services/weatherService";
import { Weather } from "../../types/WeatherData";

const CitySearch: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const weatherData = await getCurrentWeather(city, "en");
      setWeather(weatherData);
      setError("");
    } catch (error) {
      setWeather(null);
      setError("Error retrieving weather data. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city name"
      />
      <button onClick={handleSearch}>Search</button>

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Feels like: {weather.main.feels_like}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Pressure: {weather.main.pressure}Pa</p>
          <p>Description: {weather.weather[0].description}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default CitySearch;
