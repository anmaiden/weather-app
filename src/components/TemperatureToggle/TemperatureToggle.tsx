import React, { useState } from "react";

interface TemperatureToggleProps {
  celsiusTemperature: number;
  fahrenheitTemperature: number;
}

const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  celsiusTemperature,
  fahrenheitTemperature,
}) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const roundedCelsiusTemperature = Math.round(celsiusTemperature);
  const roundedFahrenheitTemperature = Math.round(fahrenheitTemperature);

  return (
    <div className="temperature-toggle">
      <p className="temperature">
        {isCelsius ? roundedCelsiusTemperature : roundedFahrenheitTemperature}
        <span className="units-measurement" onClick={toggleTemperatureUnit}>
          <span className={`temperature-unit ${isCelsius ? "active" : ""}`}>
            C
          </span>
          {" | "}
          <span className={`temperature-unit ${!isCelsius ? "active" : ""}`}>
            F
          </span>
        </span>
      </p>
    </div>
  );
};

export default TemperatureToggle;
