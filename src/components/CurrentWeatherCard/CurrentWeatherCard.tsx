import React, { useEffect, useState } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import "../../i18n";
import { Weather } from "../../types/WeatherData";
import TemperatureToggle from "../TemperatureToggle/TemperatureToggle";
import "./CurrentWeatherCard.css";
import "../CurrentDate/CurrentDate";
import CurrentDate from "../CurrentDate/CurrentDate";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import { API_KEY, getCurrentWeather } from "../../services/weatherService";
import { setCurrentWeather } from "../../reducers/weatherReducer";

interface CurrentWeatherCardProps {
  weather: Weather;
  handleClose: () => void;
  t: (key: string) => string;
  language: string;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  handleClose,
  t,
  language,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const [isCelsius, setIsCelsius] = useState(() => {
    const storedUnit = localStorage.getItem("temperatureUnit");
    return storedUnit ? storedUnit === "C" : true;
  });
  //save temp init in local storage
  const handleTemperatureUnitChange = (isCelsius: boolean) => {
    setIsCelsius(isCelsius);
    localStorage.setItem("temperatureUnit", isCelsius ? "C" : "F");
  };

  const internalHandleClose = () => {
    setIsOpen(false);
    handleClose();
  };

  const feelsLikeTemperature = isCelsius
    ? Math.round(weather.main.feels_like)
    : Math.round(weather.main.feels_like * 1.8 + 32);

  if (!isOpen) {
    return null;
  }
  const iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  return (
    <div>
      <div className="city-card-wrapper">
        <div className="card-item">
          <div className="close-btn">
            <button onClick={internalHandleClose} className="btn-close">
              X
            </button>
          </div>
          <div className="city-info-wrapper">
            <div className="city-name">
              {weather.name}, {weather.sys.country}
            </div>

            <div className="description-icon-wrapper">
              <img src={iconUrl} alt="Weather icon" className="weather-icon" />
              <p className="weather-description">
                {t(weather.weather[0].description)}
              </p>
            </div>
          </div>
          <div className="current-date">
            <CurrentDate />
          </div>
          <div className="city-graph">
            <TemperatureChart
              key={weather.dt.dt}
              city={weather.name}
              language={language}
              API_KEY={API_KEY}
            />
          </div>
          <div className="weather-report-wrapper">
            <div className="temperature-wrapper">
              <TemperatureToggle
                celsiusTemperature={weather.main.temp}
                fahrenheitTemperature={weather.main.temp * 1.8 + 32}
                onTemperatureUnitChange={handleTemperatureUnitChange}
              />
              <div className="feels-like">
                {t("feelsLike")}: {feelsLikeTemperature}{" "}
                <span>{isCelsius ? `${"\u00b0"}C` : `${"\u00b0"}F`}</span>
              </div>
            </div>
            <div className="weather-info-wrapper">
              <p className="wind">
                {t("wind")}:{" "}
                <span className="wind-number">{weather.wind.speed}</span>{" "}
                <span>{t("m/s")}</span>
              </p>
              <p className="humidity">
                {t("humidity")}:{" "}
                <span className="humidity-number">{weather.main.humidity}</span>{" "}
                <span>%</span>
              </p>
              <p className="pressure">
                {t("pressure")}:{" "}
                <span className="pressure-number">{weather.main.pressure}</span>{" "}
                <span>{t("Pa")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(CurrentWeatherCard);
