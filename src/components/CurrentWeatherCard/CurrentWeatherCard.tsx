import React, { useState } from "react";
import { Weather } from "../../types/WeatherData";
import TemperatureToggle from "../TemperatureToggle/TemperatureToggle";
import "./CurrentWeatherCard.css";

interface CurrentWeatherCardProps {
  weather: Weather;
  handleClose: () => void;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  handleClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const internalHandleClose = () => {
    setIsOpen(false);
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="city-card-wrapper">
      <div className="card-item">
        <div className="close-btn">
          <button className="btn-close" onClick={internalHandleClose}>
            x
          </button>
        </div>
        <div className="city-info-wrapper">
          <p className="city-name">
            {weather.name}, {weather.sys.country}
          </p>
          <img src="" alt="" className="weather-icon" />
          <p className="weather-description">
            {weather.weather[0].description}
          </p>
        </div>
        <div className="city-graph">
          <p>тут будет график</p>
        </div>
        <div className="weather-report-wrapper">
          <div className="temperature-wrapper">
            <TemperatureToggle
              celsiusTemperature={weather.main.temp}
              fahrenheitTemperature={weather.main.temp * 1.8 + 32}
            />
          </div>
          <div className="weather-info-wrapper">
            <p className="wind">
              Wind: <span className="wind-number">{weather.wind.speed}</span>{" "}
              m/s
            </p>
            <p className="humidity">
              Humidity:{" "}
              <span className="humidity-number">{weather.main.humidity}</span> %
            </p>
            <p className="pressure">
              Pressure:{" "}
              <span className="pressure-number">{weather.main.pressure}</span>{" "}
              Pa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
