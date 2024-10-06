"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
  AlertCircle,
  Cloud,
  Droplets,
  Eye,
  Gauge,
  Loader,
  MapPin,
  Sun,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

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

const getAirQualityDescription = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const getWeatherInsight = () =>
  //   temp: number,
  //   humidity: number,
  //   windSpeed: number
  {
    let insights = [];
    //   if (temp > 30)
    //     insights.push("It's very hot outside. Stay hydrated and seek shade.");
    //   if (temp < 5) insights.push("It's very cold. Bundle up and stay warm.");
    //   if (humidity > 70)
    //     insights.push("High humidity may make it feel warmer than it is.");
    //   if (windSpeed > 20)
    //     insights.push("Strong winds today. Be cautious when outdoors.");
    //   return insights.length > 0 ? insights : ["Enjoy the weather!"];
    return ["Loading..."];
  };

export default function EnhancedWeatherDisplay({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [airQuality, setAirQuality] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const [currentWeather, forecast, airQuality] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: { lat, lon, appid: API_KEY, units: "metric" },
          }),
          axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: { lat, lon, appid: API_KEY, units: "metric" },
          }),
          axios.get(`http://api.openweathermap.org/data/2.5/air_pollution`, {
            params: { lat, lon, appid: API_KEY },
          }),
        ]);

        setWeatherData({
          temp: currentWeather.data.main.temp,
          feelsLike: currentWeather.data.main.feels_like,
          condition: currentWeather.data.weather[0].description,
          humidity: currentWeather.data.main.humidity,
          windSpeed: currentWeather.data.wind.speed,
          icon: currentWeather.data.weather[0].icon,
          visibility: currentWeather.data.visibility / 1000, // Convert to km
          pressure: currentWeather.data.main.pressure,
          name: currentWeather.data.name,
        });

        setHourlyForecast(forecast.data.list.slice(0, 8));
        setAirQuality(airQuality.data.list[0].main);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data. Please try again later.");
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-5 bg-red-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader className="animate-spin" width={30} height={30} />
        <span className="ml-2">Loading Weather</span>
      </div>
    );
  }

  return (
    <Card className="w-full  mx-auto bg-gradient-to-br from-blue-100 to-blue-200 mt-5 shadow-xl">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-800">
              Current Weather
            </span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{weatherData.name}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="hourly">24-Hour Forecast</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-5xl font-bold text-blue-900">
                      {weatherData.temp.toFixed(1)}°C
                    </h2>
                    <p className="text-xl text-blue-700 capitalize">
                      {weatherData.condition}
                    </p>
                    <p className="text-sm text-blue-600">
                      Feels like {weatherData.feelsLike.toFixed(1)}°C
                    </p>
                  </div>
                  {getWeatherIcon(weatherData.icon)}
                </div>
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
                      Wind: {weatherData.windSpeed.toFixed(1)} m/s
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-blue-700">
                      Visibility: {weatherData.visibility.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-blue-700">
                      Pressure: {weatherData.pressure} hPa
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Air Quality
                </h3>
                {airQuality && (
                  <>
                    <Progress
                      value={(airQuality.aqi / 5) * 100}
                      className="w-full"
                    />
                    <p className="mt-2 text-blue-700">
                      {getAirQualityDescription(airQuality.aqi)} (AQI:{" "}
                      {airQuality.aqi})
                    </p>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="hourly">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hourlyForecast.map((hour, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-50 rounded-lg p-3 text-center"
                >
                  <p className="font-semibold">
                    {new Date(hour.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {getWeatherIcon(hour.weather[0].icon)}
                  <p className="text-blue-800">{hour.main.temp.toFixed(1)}°C</p>
                  <p className="text-sm text-blue-600 capitalize">
                    {hour.weather[0].description}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="insights">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Weather Insights
              </h3>
              <ul className="list-disc pl-5">
                {getWeatherInsight().map((insight, index) => (
                  //   weatherData.temp,
                  //   weatherData.humidity,
                  //   weatherData.windSpeed
                  <li key={index} className="text-blue-700 mb-2">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
