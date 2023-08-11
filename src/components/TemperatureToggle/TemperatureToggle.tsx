import React, { useState } from "react";

interface TemperatureToggleProps {
  celsiusTemperature: number;
  fahrenheitTemperature: number;
  onTemperatureUnitChange: (isCelsius: boolean) => void;
}

const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  celsiusTemperature,
  fahrenheitTemperature,
  onTemperatureUnitChange,
}) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
    onTemperatureUnitChange(!isCelsius);
  };

  const roundedCelsiusTemperature = Math.round(celsiusTemperature);
  const roundedFahrenheitTemperature = Math.round(fahrenheitTemperature);

  return (
    <div className="temperature-toggle">
      <p className="temperature">
        <span className="temperature-number">
          {isCelsius ? roundedCelsiusTemperature : roundedFahrenheitTemperature}
        </span>
        <span className="units-measurement" onClick={toggleTemperatureUnit}>
          <span className={`temperature-unit ${isCelsius ? "active" : ""}`}>
            {"\u00b0"}C
          </span>
          {" | "}
          <span className={`temperature-unit ${!isCelsius ? "active" : ""}`}>
            {"\u00b0"}F
          </span>
        </span>
      </p>
    </div>
  );
};

export default TemperatureToggle;
