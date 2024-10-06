import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Sprout, Cloud, CloudRain } from "lucide-react";
import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { Loader } from "lucide-react";
import EnhancedWeatherDisplay from "@/components/Weather";
import corn from "@/assets/corn.jpeg";
import cotton from "@/assets/cotton.jpeg";
import rice from "@/assets/rice.jpg";
import millets from "@/assets/millets.jpg";
import wheat from "@/assets/wheat.webp";

const getCropImage = (cropName: string) => {
  switch (cropName.toLowerCase()) {
    case "corn":
      return corn;
    case "cotton":
      return cotton;
    case "rice":
      return rice;
    case "millets":
      return millets;
    case "wheat":
      return wheat;
    default:
      return "";
  }
};

export default function DetailsPage() {
  const [searchParams] = useSearchParams();
  const [locationName, setLocationName] = useState("");
  const [cropSchedule, setCropSchedule] = useState("");
  const crop = searchParams.get("crop");
  const lat: number = parseFloat(searchParams.get("lat") ?? "0");
  const lon: number = parseFloat(searchParams.get("lon") ?? "0");

  const fetchLocationName = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
        import.meta.env.VITE_MAPBOX_TOKEN
      }`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      setLocationName(data.features[0].place_name);
    } else {
      setLocationName("Location not found");
    }
  };

  const fetchCropSchedule = async () => {
    if (!crop) return;
    const response = await fetch(
      "https://nasaspaceapps.aryanranderiya1478.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Please provide a detailed crop schedule for growing ${crop} in location ${locationName}, ${lat}, ${lon}. 
              
              I want it on the monthly basis, with each growth stage. 

              The schedule should include the following elements:

              Timeframe
              Sowing methods
              Irrigation timings
              Fertilizer information
              Ideal weather conditions
              Optimal planting and harvesting timings
              Soil preparation techniques
              Pest and disease management strategies
              Crop rotation plans
              Harvesting techniques
              Post-harvest handling practices
              Nutrient requirements at various growth stages
              Key growth stages and expected timelines
              Additional weather considerations
              Local adaptations based on regional climate or soil conditions

              Present all the information in a clear, comprehensive table format using Markdown.  Attach no additional information except the table in markdown formatting.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get response from LLM");
    }

    console.log(response);
    const data = await response.json();
    console.log(data);

    setCropSchedule(data?.response);
  };

  useEffect(() => {
    fetchLocationName(lat, lon);
    fetchCropSchedule();
  }, [lat, lon]);

  return (
    <div className="w-screen min-h-screen bg-muted p-8 pt-[60px]">
      <div className="overflow-hidden relative z-10 rounded-xl mb-3">
        <h1 className="mt-6 text-3xl font-bold mb-6 text-center">
          {!!crop && (
            <img
              src={getCropImage(crop)}
              alt={crop}
              className="w-full left-0 h-full object-cover absolute z-[0] opacity-20"
            />
          )}
          <span className="z-[1] relative">Agricultural Information</span>
        </h1>

        <div className="my-8 text-center z-[1] relative">
          <h2 className="text-xl mb-2 space-x-2">
            <span className="font-bold">Current Crop:</span>
            <span>{crop}</span>
          </h2>
          <h4 className="space-x-2 mb-2">
            <span className="font-bold">Location:</span>
            <span>{locationName}</span>
          </h4>

          <div className="flex items-center justify-center gap-3 my-1">
            <p className="flex gap-1 items-center">
              <span className="font-bold">Latitude:</span>
              <span>{lat}</span>
            </p>

            <p className="flex gap-1 items-center">
              <span className="font-bold">Longitude:</span>
              <span>{lon}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-blue-50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Droplet className="mr-2" />
              Irrigation Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-blue-900">
              <li>Water deeply and less frequently</li>
              <li>Use mulch to retain moisture</li>
              <li>Water early in the morning</li>
              <li>Consider drip irrigation for efficiency</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-green-50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Sprout className="mr-2" />
              Crop Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-green-900">Based on your location</p>
            <ul className="list-disc list-inside space-y-2 text-green-900">
              <li>Corn</li>
              <li>Soybeans</li>
              <li>Wheat</li>
              <li>Alfalfa</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-700">
              <Cloud className="mr-2" />
              Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-amber-900 flex items-center">
                  <Cloud className="mr-2" /> Drought Possibility
                </h3>
                <p className="text-amber-800">
                  Low - Adequate rainfall expected
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 flex items-center">
                  <CloudRain className="mr-2" /> Flood Possibility
                </h3>
                <p className="text-amber-800">
                  Moderate - Heavy rains forecasted next week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EnhancedWeatherDisplay lat={lat} lon={lon} />

      <div className="font-bold text-2xl  mt-5 text-center">Crop Schedule</div>
      {cropSchedule.length <= 0 ? (
        <div className="w-full h-36 flex justify-center items-center flex-col">
          <Loader className="animate-spin" />
          <div className="text-sm">Loading Crop Schedule</div>
        </div>
      ) : (
        <div className="details_markdown flex items-center flex-col justify-center ">
          <Markdown remarkPlugins={[remarkGfm]}>{cropSchedule}</Markdown>
        </div>
      )}
    </div>
  );
}
