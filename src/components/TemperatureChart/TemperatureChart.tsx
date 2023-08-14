import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getCurrentWeather } from "../../services/weatherService";

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

  const [currentLanguage, setCurrentLanguage] = useState("en"); // add  state for language

  useEffect(() => {
    setCurrentLanguage(window.localStorage.getItem("language") || "en"); // get lang from localStorage
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const weatherData = await getCurrentWeather(city, language);
      setCurrentTemp(weatherData.main.temp);
    };
    fetchData();
  }, [city, language]);

  useEffect(() => {
    if (chartRef.current && currentTemp !== null) {
      const chartLabels: string[] = [];
      const chartTemps: number[] = [];

      const fetchData = async () => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=${currentLanguage}&units=metric` // используем текущий язык для запроса к API
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
  }, [chartRef, currentTemp, city, currentLanguage, API_KEY]); // use current lang

  return <canvas ref={chartRef} />;
};

export default TemperatureChart;
