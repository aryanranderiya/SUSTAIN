import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Sprout, Cloud, CloudRain } from "lucide-react";

export default function DetailsPage() {
  const [searchParams] = useSearchParams();

  const crop = searchParams.get("crop");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  return (
    <div className="w-screen min-h-screen bg-muted p-8 pt-[60px]">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Agricultural Information
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-blue-50">
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

        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Sprout className="mr-2" />
              Crop Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-green-900">
              Based on your location (Lat: {lat}, Lon: {lon}):
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-900">
              <li>Corn</li>
              <li>Soybeans</li>
              <li>Wheat</li>
              <li>Alfalfa</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50">
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

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Current Crop: {crop}</h2>
        <p>Latitude: {lat}</p>
        <p>Longitude: {lon}</p>
      </div>
    </div>
  );
}
