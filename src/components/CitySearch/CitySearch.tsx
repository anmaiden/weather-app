import React, { useEffect, useState } from "react";
import "./CitySearch.css";
import { withTranslation } from "react-i18next";
import {
  API_KEY,
  getCurrentWeather,
  getCurrentWeatherByLocation,
} from "../../services/weatherService";

import { Weather } from "../../types/WeatherData";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrentWeatherCard";

interface CitySearchProps {
  t: (key: string) => string;
}

interface City {
  name: string;
  country: string;
}

const CitySearch: React.FC<CitySearchProps> = ({ t }) => {
  const [city, setCity] = useState("");
  const [weatherCards, setWeatherCards] = useState<Weather[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [citiesHistory, setCitiesHistory] = useState<City[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);

  useEffect(() => {
    const citiesFromLocalStorage = localStorage.getItem("cities");
    if (citiesFromLocalStorage) {
      setCitiesHistory(JSON.parse(citiesFromLocalStorage));
    }
  }, []);

  const handleSearch = async (cityName: string) => {
    try {
      const weatherData = await getCurrentWeather(cityName, "en");
      const id = Date.now().toString(); // uniq id
      setWeatherCards((prevWeatherCards) => [
        ...prevWeatherCards,
        { ...weatherData, id },
      ]); // add id for card

      // Save city to local storage
      setCitiesHistory((prevCities) => {
        const updatedCities = [...prevCities];
        const existingCity = updatedCities.find(
          (city) => city.name.toLowerCase() === cityName.toLowerCase()
        );
        if (!existingCity) {
          updatedCities.push({
            name: cityName,
            country: weatherData.sys.country,
          });
        }
        localStorage.setItem("cities", JSON.stringify(updatedCities));
        return updatedCities;
      });

      setCity("");
      setError(null);
      setSuggestedCities([]);
    } catch (error) {
      console.error("Error retrieving weather data. Please try again.", error);
      setError("Error retrieving weather data. Please try again.");
    }
  };

  //////////////////////////// User Location  //////////////////////////

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

  if (
    locationWeather &&
    !weatherCards.find((cityWeather) => cityWeather.id === locationWeather.id)
  ) {
    setWeatherCards([locationWeather, ...weatherCards]);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // close a weather card
  const handleClose = (id: string) => {
    setWeatherCards((prevWeatherCards) => {
      const updatedCards = [...prevWeatherCards];
      const index = updatedCards.findIndex((card) => card.id === id); // find id
      updatedCards.splice(index, 1);
      return updatedCards;
    });
  };

  // search by key press Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cityName = city.trim();
      if (cityName.length > 0) {
        handleSearch(cityName);
      }
    }
  };

  // save citiesHistory
  const handleInputClick = () => {
    if (city.trim().length === 0) {
      setSuggestedCities(citiesHistory);
    }
    setCitiesHistory((prevCities) => {
      localStorage.setItem("cities", JSON.stringify(prevCities));
      return prevCities;
    });
  };

  //updates the current value of the input, then filter  by the name of the city that starts with the entered value,  If the value of the entered city is empty, `suggestedCities` will be cleared.

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);

    if (value.trim().length > 0) {
      const filteredCities = citiesHistory.filter((city) =>
        city.name.toLowerCase().startsWith(value.toLowerCase())
      );
      const formattedCities = filteredCities.map((city) => ({
        name: `${city.name.charAt(0).toUpperCase()}${city.name.slice(1)}`,
        country: city.country,
      }));
      setSuggestedCities(formattedCities);
    } else {
      setSuggestedCities([]);
    }
  };

  //finds the selected city in `citiesHistory`, then updates `city` and calls `handleSearch' with the name of the selected city.

  const handleOptionClick = (name: string) => {
    const selectedCity = citiesHistory.find(
      (city) => city.name.toLowerCase() === name.toLowerCase()
    );
    if (selectedCity) {
      setCity(selectedCity.name);
      handleSearch(selectedCity.name);
    }
  };

  // if user unfocused input
  const handleInputBlur = () => {
    setTimeout(() => {
      setSuggestedCities([]);
    }, 100);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={city}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={t("placeholder")}
        list="cities"
        onClick={handleInputClick}
        onBlur={handleInputBlur}
      />
      <button onClick={() => handleSearch(city)} className="search-btn">
        {t("add")}
      </button>
      {error && <p className="error-message">{t("error")}</p>}
      {suggestedCities.length > 0 && (
        <ul className="city-suggestions">
          {suggestedCities.map((city) => (
            <li
              key={`${city.name}-${city.country}`}
              onClick={() => handleOptionClick(city.name)}
            >
              <span className="city-name">{city.name}</span>
              <span className="city-country">{`, ${city.country}`}</span>
            </li>
          ))}
        </ul>
      )}
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
