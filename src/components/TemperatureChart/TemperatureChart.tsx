import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getCurrentWeather } from "../../services/weatherService";
import { Weather } from "../../types/WeatherData";

interface TemperatureChartProps {
  city: string;
  language: string;
  API_KEY: string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  city,
  language,
  API_KEY,
}: TemperatureChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    setCurrentLanguage(window.localStorage.getItem("language") || "en");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { lat, lon } = await getLatLonByCity(city, API_KEY); // get lat and lon by city
        const weatherData: Weather = await getCurrentWeather(
          lat,
          lon,
          null,
          language
        ); // return type of getCurrentWeather
        setCurrentTemp(weatherData.main.temp);
        setError(null);
      } catch (error) {
        console.error(
          "Error retrieving weather data. Please try again.",
          error
        );
        setError("Error retrieving weather data. Please try again.");
      }
    };

    fetchData(); 
  }, []);

  useEffect(() => {
    if (chartRef.current && currentTemp !== null && !error) {
      const chartLabels: string[] = [];
      const chartTemps: number[] = [];

      const fetchData = async () => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=${currentLanguage}&units=metric`
        );
        const data = await response.json();

        data.list.forEach((dayData: any) => {
          const day = new Date(dayData.dt * 1000);
          if (day.getHours() === 12) {
            chartLabels.push(`${day.getDate()}.${day.getMonth() + 1}`);
            chartTemps.push(dayData.main.temp);
          }
        });

        const chartData = {
          labels: chartLabels,
          datasets: [
            {
              label: "Temperature, °C",
              data: chartTemps,
              backgroundColor: "rgba(255,229,207, 0.5)",
              borderColor: "rgba(255,229,207, 0)",
            },
          ],
        };

        new Chart(chartRef.current!, {
          type: "line",
          data: chartData,

          options: {
            scales: {
              y: {
                display: false,
                beginAtZero: true,
              },
            },
            elements: {
              line: {
                fill: true,
                tension: 0.2,
              },
            },
            plugins: {
              legend: {
                display: false,
                labels: {
                  font: {
                    size: 13,
                  },
                },
              },
            },
          },
        });
      };

      fetchData();
    }
  }, [chartRef, currentTemp, city, currentLanguage, API_KEY, error]);

  return (
    <>
      {error && <p>Unable to load temperature chart.{error}</p>}
      <canvas ref={chartRef} />;
    </>
  );
};

//getting the coordinates of the location by the name of the city.
const getLatLonByCity = async (city: string, API_KEY: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );
  const data = await response.json();
  return { lat: data.coord.lat, lon: data.coord.lon }; // return object with lat and lon
};

export default TemperatureChart;
