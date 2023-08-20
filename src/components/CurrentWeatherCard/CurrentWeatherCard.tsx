import React, { useEffect, useState } from "react";
import "../../i18n";
import { Weather } from "../../types/WeatherData";
import TemperatureToggle from "../TemperatureToggle/TemperatureToggle";
import "./CurrentWeatherCard.css";
import "../CurrentDate/CurrentDate";
import CurrentDate from "../CurrentDate/CurrentDate";
import TemperatureChart from "../TemperatureChart/TemperatureChart";
import { API_KEY } from "../../services/weatherService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers/store";
import { setTemperatureUnit } from "../../reducers/weatherReducer";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

export interface CurrentWeatherCardProps {
  weather: Weather;
  onClose: (id: string) => void;
  cityId: string;
  handleClose: () => void;
  language: string | null;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  onClose,
}) => {
  // value of the temperature units will be read from localStorage
  const temperatureUnit = useSelector(
    (state: RootState) => state.weather.temperatureUnit
  );
  const dispatch = useDispatch();

  // value of the temperature units will be read from localStorage
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  useEffect(() => {
    const storedUnit = localStorage.getItem("temperatureUnit");
    if (storedUnit && (storedUnit === "C" || storedUnit === "F")) {
      setTempUnit(storedUnit);
    }
  }, []);

  // calculating temperature in field FeelsLike
  const feelsLikeTemperature =
    tempUnit === "C"
      ? Math.round(weather.main.feels_like)
      : Math.round(weather.main.feels_like * 1.8 + 32);

  // icon for weather
  const iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

  // remove card on click "close"
  const handleRemoveCard = () => {
    onClose(weather.id);
  };

  const handleTemperatureUnitChange = (isCelsius: boolean) => {
    const newTemperatureUnit = isCelsius ? "C" : "F";
    localStorage.setItem("temperatureUnit", newTemperatureUnit);
    setTempUnit(newTemperatureUnit);
    dispatch(setTemperatureUnit(newTemperatureUnit));
  };

  return (
    <div>
      <div className="city-card-wrapper">
        <div className="card-item">
          <div className="close-btn">
            <button onClick={handleRemoveCard} className="btn-close">
              &#x2715;
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
              API_KEY={API_KEY}
              language="en"
            />
          </div>
          <div className="weather-report-wrapper">
            <div className="temperature-wrapper">
              <TemperatureToggle
                celsiusTemperature={weather.main.temp}
                fahrenheitTemperature={weather.main.temp * 1.8 + 32}
                temperatureUnit={tempUnit}
                onToggle={handleTemperatureUnitChange}
              />
              <div className="feels-like">
                {t("feelsLike")}: {feelsLikeTemperature}
                <span>{tempUnit === "C" ? "\u00b0C" : "\u00b0F"}</span>
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
