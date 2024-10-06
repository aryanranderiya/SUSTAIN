"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, Droplets, Sun, Wind, Umbrella, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Replace with your actual OpenWeatherMap API key
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_KEY;

const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case "01d":
      return <Sun className="w-6 h-6 text-yellow-400" />;
    case "02d":
    case "03d":
    case "04d":
      return <Cloud className="w-6 h-6 text-gray-400" />;
    case "09d":
    case "10d":
      return <Droplets className="w-6 h-6 text-blue-400" />;
    default:
      return <Sun className="w-6 h-6 text-yellow-400" />;
  }
};

export default function EnhancedWeatherDisplay({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: API_KEY,
              units: "metric",
            },
          }
        );

        const currentWeather = {
          temp: response.data.main.temp,
          feelsLike: response.data.main.feels_like,
          condition: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
          icon: response.data.weather[0].icon,
          uvIndex: "N/A", // Not available in this endpoint
          visibility: response.data.visibility / 1609, // Convert to miles
          pressure: response.data.main.pressure,
        };

        setWeatherData(currentWeather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  if (!weatherData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" width={30} height={30} />
        Loading Weather
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto bg-gradient-to-br from-blue-100 to-blue-200 mt-5 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-800">
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Weather */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold text-blue-900">
                  {weatherData.temp}°C
                </h2>
                <p className="text-xl text-blue-700">{weatherData.condition}</p>
                <p className="text-sm text-blue-600">
                  Feels like {weatherData.feelsLike}°C
                </p>
              </div>
              {getWeatherIcon(weatherData.icon)}
            </div>

            {/* Additional Current Weather Details */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-blue-700">
                  Humidity: {weatherData.humidity}%
                </span>
              </div>
              <div className="flex items-center">
                <Wind className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-blue-700">
                  Wind: {weatherData.windSpeed} mph
                </span>
              </div>
              <div className="flex items-center">
                <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-blue-700">
                  UV Index: {weatherData.uvIndex}
                </span>
              </div>
              <div className="flex items-center">
                <Umbrella className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-blue-700">
                  Precipitation: {weatherData.precipChance}%
                </span>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Weather Details
            </h3>
            <ul className="list-disc pl-5">
              <li>Pressure: {weatherData.pressure} hPa</li>
              <li>Visibility: {weatherData.visibility.toFixed(1)} miles</li>
              {/* Add other details as necessary */}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
