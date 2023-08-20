import React from "react";

interface TemperatureToggleProps {
  celsiusTemperature: number;
  fahrenheitTemperature: number;
  temperatureUnit: "C" | "F";
  onToggle: (isCelsius: boolean) => void;
}

const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  celsiusTemperature,
  fahrenheitTemperature,
  temperatureUnit,
  onToggle,
}) => {
  const roundedTemperature = Math.round(
    temperatureUnit === "C" ? celsiusTemperature : fahrenheitTemperature
  );

  return (
    <div className="temperature-toggle">
      <p className="temperature">
        <span className="temperature-number">{roundedTemperature}</span>
        <span className="units-measurement">
          <span
            className={`temperature-unit ${
              temperatureUnit === "C" ? "active" : ""
            }`}
            onClick={() => onToggle(true)}
          >
            {"\u00b0"}C
          </span>
          {" | "}
          <span
            className={`temperature-unit ${
              temperatureUnit === "F" ? "active" : ""
            }`}
            onClick={() => onToggle(false)}
          >
            {"\u00b0"}F
          </span>
        </span>
      </p>
    </div>
  );
};

export default TemperatureToggle;
