import { LocationType } from "@/pages/Home";
import { Loader, MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";

export default function HomepageMap({
  setLocationName,
  location,
  setLocation,
}: {
  setLocationName: (value: string) => void;
  setLocation: (location: LocationType) => void;
  location: LocationType;
}) {
  const [initialCoordinates, setInitialCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: initialCoordinates.longitude,
    latitude: initialCoordinates.latitude,
    zoom: 3,
  });

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

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          setInitialCoordinates(newLocation);
          setViewState({
            ...viewState,
            longitude: newLocation.longitude,
            latitude: newLocation.latitude,
            zoom: 14,
          });
          fetchLocationName(newLocation.latitude, newLocation.longitude);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setViewState((prev: any) => ({
        ...prev,
        longitude: location.longitude,
        latitude: location.latitude,
        zoom: 14,
      }));
    }
  }, [location]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" width={30} height={30} />
        Loading
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} style={{ width: "100vw", height: "100vh" }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={viewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/standard"
        onClick={(e) => {
          setLocation({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
          fetchLocationName(e.lngLat.lat, e.lngLat.lng);
        }}
      >
        {initialCoordinates.latitude && initialCoordinates.longitude && (
          <>
            <Marker
              longitude={initialCoordinates.longitude}
              latitude={initialCoordinates.latitude}
              anchor="bottom"
            >
              <div className="w-6 h-6 bg-blue-600 drop-shadow-2xl z-10 border-white border-[3px] rounded-full" />
            </Marker>

            <Popup
              longitude={initialCoordinates.longitude}
              latitude={initialCoordinates.latitude}
              anchor="top"
              closeOnClick={false}
              onClose={() => console.log("")}
            >
              <div onClick={(e) => e.stopPropagation()}>You are here</div>
            </Popup>
          </>
        )}

        {initialCoordinates.latitude !== location.latitude &&
          location.latitude &&
          location.longitude && (
            <>
              <Marker
                longitude={location.longitude}
                latitude={location.latitude}
                anchor="bottom"
              >
                <MapPin fill="red" color="#ffc7c7" width={35} height={35} />
              </Marker>
            </>
          )}
      </Map>
    </div>
  );
}
