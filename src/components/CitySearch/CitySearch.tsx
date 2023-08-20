import React, { useEffect, useState } from "react";
import "./CitySearch.css";
import { withTranslation } from "react-i18next";
import { getCurrentWeather } from "../../services/weatherService";
import { Weather } from "../../types/WeatherData";
import CurrentWeatherCard from "../CurrentWeatherCard/CurrentWeatherCard";

interface CitySearchProps {
  t: (key: string) => string;
}

export interface City {
  id: string;
  name: string;
  country: string;
}

const CitySearch: React.FC<CitySearchProps> = ({ t }) => {
  const [city, setCity] = useState("");
  const [weatherCards, setWeatherCards] = useState<Weather[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [citiesHistory, setCitiesHistory] = useState<City[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
  const [locationWeather, setLocationWeather] = useState<Weather | null>(null);

  //get cities from localStorage
  useEffect(() => {
    const citiesFromLocalStorage = localStorage.getItem("cities");
    if (citiesFromLocalStorage) {
      setCitiesHistory(JSON.parse(citiesFromLocalStorage));
    }
  }, []);

  // save cities in localStorage with func setCitiesHistory
  const handleSearch = async (cityName: string) => {
    try {
      const currentLanguage = window.localStorage.getItem("language");
      const weatherData = await getCurrentWeather(
        null,
        null,
        cityName,
        currentLanguage
      );
      const id = Date.now().toString(); // generate unique id
      const weatherDataWithId = { ...weatherData, id };

      // check if weather card for this city already exists
      if (!weatherCards.some((weatherCard) => weatherCard.id === id)) {
        setWeatherCards((prevWeatherCards) => [
          ...prevWeatherCards,
          weatherDataWithId,
        ]);
        // Save the updated weather cards to localStorage
        localStorage.setItem(
          "weatherCards",
          JSON.stringify([...weatherCards, weatherDataWithId])
        );
      }

      // Save city to local storage
      setCitiesHistory((prevCities) => {
        const updatedCities = [...prevCities];
        const existingCity = updatedCities.find(
          (city) => city.name.toLowerCase() === cityName.toLowerCase()
        );
        if (!existingCity) {
          updatedCities.push({
            id: weatherData.dt.dt,
            name: cityName,
            country: weatherData.sys.country,
          });
          localStorage.setItem("cities", JSON.stringify(updatedCities));
        }
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

  //////////////////////////////////////////// GEOLOCATION //////////////////////////////////////////////////////////////////

  // if user apply geolocation we get his coordinates
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getCurrentWeatherByLatLng(lat, lon);
      });
    }
  }, []);

  // we add a weather card with weather using coordinates and setWeatherCards first - userCard (his city) then weatherCards
  const getCurrentWeatherByLatLng = async (lat: number, lon: number) => {
    const currentLanguage = window.localStorage.getItem("language");
    try {
      const weatherData = await getCurrentWeather(
        lat,
        lon,
        null,
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

  // Removing cards from weatherCards array in localStorage
  const removeWeatherCardFromLocalStorage = (id: string) => {
    const cardsFromLocalStorage = localStorage.getItem("weatherCards");
    if (cardsFromLocalStorage) {
      const cards: Weather[] = JSON.parse(cardsFromLocalStorage);
      const updatedCards = cards.filter((card) => card.id !== id);
      localStorage.setItem("weatherCards", JSON.stringify(updatedCards));
    }
  };

  const handleRemoveCard = (id: string) => {
    if (!locationWeather || locationWeather.id !== id) {
      setWeatherCards((weatherCards) =>
        weatherCards.filter((card) => card.id !== id)
      );
      removeWeatherCardFromLocalStorage(id);
    }
  };

  const handleClose = () => {
    //
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cityName = city.trim();
      if (cityName.length > 0) {
        handleSearch(cityName);
      }
    }
  };
  // show citites under input
  const handleInputClick = () => {
    if (city.trim().length === 0) {
      setSuggestedCities(citiesHistory);
    }
    setCitiesHistory((prevCities) => {
      localStorage.setItem("cities", JSON.stringify(prevCities));
      return prevCities;
    });
  };

  // search cities history
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);

    if (value.trim().length > 0) {
      const filteredCities = citiesHistory.filter((city) =>
        city.name.toLowerCase().startsWith(value.toLowerCase())
      );
      const formattedCities: City[] = filteredCities.map((city) => ({
        id: city.id,
        name: `${city.name.charAt(0).toUpperCase()}${city.name.slice(1)}`,
        country: city.country,
      }));
      setSuggestedCities(formattedCities);
    } else {
      setSuggestedCities([]);
    }
  };

  // click on a suggestion
  const handleOptionClick = (name: string) => {
    const selectedCity = citiesHistory.find(
      (city) => city.name.toLowerCase() === name.toLowerCase()
    );
    if (selectedCity) {
      setCity(selectedCity.name);
      handleSearch(selectedCity.name);
    }
  };

  // unfocus input field
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
        {weatherCards.map((weatherData) => (
          <CurrentWeatherCard
            language={window.localStorage.getItem("language")}
            key={weatherData.id}
            weather={weatherData}
            cityId={weatherData.id}
            onClose={handleRemoveCard}
            handleClose={handleClose}
          />
        ))}
      </div>
    </div>
  );
};

export default withTranslation()(CitySearch);
