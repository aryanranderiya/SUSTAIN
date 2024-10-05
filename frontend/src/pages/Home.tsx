import HomepageMap from "@/components/Map/HomepageMap";
import { RegionSelectorComponent } from "@/components/region-selector";
import { useState } from "react";
export interface LocationType {
  latitude: number | null;
  longitude: number | null;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState<string>("");
  const [location, setLocation] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });

  return (
    <div className="w-screen flex">
      <RegionSelectorComponent
        open={open}
        setOpen={setOpen}
        locationName={locationName}
        location={location}
      />
      <HomepageMap
        setLocationName={setLocationName}
        locationName={locationName}
        location={location}
        setLocation={setLocation}
      />
    </div>
  );
}
