import { Loader, MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { SetStateAction, useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl";

interface Location {
  latitude: number | null;
  longitude: number | null;
}

const initialCoordinates = {
  latitude: 0,
  longitude: 0,
};

export default function HomepageMap({ open, setOpen }) {
  const [moveEvent, setMoveEvent] = useState();
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
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
          setViewState((prev: any) => ({
            ...prev,
            longitude: newLocation.longitude!,
            latitude: newLocation.latitude!,
            zoom: 10,
          }));

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
        onClick={() => setOpen(true)}
        // onDblClick={(e) => console.log(e)}
      >
        {location.latitude && location.longitude && (
          <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
          >
            <MapPin fill="red" color="#ffc7c7" width={35} height={35} />
          </Marker>
        )}
      </Map>
    </div>
  );
}
