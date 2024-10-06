import { LlmChat } from "@/components/llm-chat";
import HomepageMap from "@/components/Map/HomepageMap";
import { RegionSelectorComponent } from "@/components/region-selector";
import { useState } from "react";
export interface LocationType {
  latitude: number | null;
  longitude: number | null;
}

export default function Home({
  location,
  setLocation,
  locationName,
  setLocationName,
}: {
  setLocationName: (value: string) => void;
  setLocation: (location: LocationType) => void;
  location: LocationType;
  locationName: string;
}) {
  const [open, setOpen] = useState(false);

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
        location={location}
        setLocation={setLocation}
      />
    </div>
  );
}
