import { LocationType } from "@/pages/Home";
import { Loader, MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl";

export default function HomepageMap({
  setLocationName,
  location,
  setLocation,
}: {
  setLocationName: (value: string) => void;
  setLocation: (location: LocationType) => void;
  location: LocationType;
}) {
  const [moveEvent, setMoveEvent] = useState();

  const [initialCoordinates, setInitialCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [viewState, setViewState] = useState<any>({
    longitude: initialCoordinates.longitude,
    latitude: initialCoordinates.latitude,
    zoom: 3,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const fetchLocationName = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
        import.meta.env.VITE_MAPBOX_TOKEN
      }`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      setLocationName(data.features[0].place_name); // Set the name of the location
    } else {
      setLocationName("Location not found");
    }
  };

  useEffect(() => {
    console.log(moveEvent);
  }, [moveEvent]);

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
          setViewState((prev: any) => ({
            ...prev,
            longitude: newLocation.longitude!,
            latitude: newLocation.latitude!,
            zoom: 10,
          }));
          fetchLocationName(newLocation.latitude, newLocation.longitude);

          setTimeout(() => {
            setLoading(false);
          }, 1000);
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
    const handleResize = () => {
      if (mapContainerRef.current) {
        setViewState((prev: any) => ({
          ...prev,
          width: mapContainerRef.current?.clientWidth,
          height: mapContainerRef.current?.clientHeight,
        }));
      }
    };

    if (mapRef.current) {
      mapRef.current?.on("mousemove", (e: SetStateAction<undefined>) => {
        setMoveEvent(e);
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (mapRef.current) mapRef.current.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      setViewState((prev: any) => ({
        ...prev,
        longitude: location.longitude,
        latitude: location.latitude,
        zoom: 10,
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
        mapStyle="mapbox://styles/mapbox/standard-satellite"
        onClick={(e) => {
          setLocation({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
          fetchLocationName(e.lngLat.lat, e.lngLat.lng);
        }}
      >
        {initialCoordinates.latitude && initialCoordinates.longitude && (
          <Marker
            longitude={initialCoordinates.longitude}
            latitude={initialCoordinates.latitude}
            anchor="bottom"
          >
            <div className="w-6 h-6 bg-blue-600 border-white border-[3px] rounded-full absolute left-[8px]" />
          </Marker>
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
              {/* 
              {showPopup && (
                <Popup
                  longitude={location.longitude}
                  latitude={location.latitude}
                  anchor="top"
                  closeOnClick
                  onClose={() => setShowPopup(false)}
                >
                  {locationName}
                </Popup>
              )} */}
            </>
          )}
      </Map>
    </div>
  );
}
