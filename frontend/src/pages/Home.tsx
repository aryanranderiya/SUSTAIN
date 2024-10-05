import HomepageMap from "@/components/Map/HomepageMap";
import { RegionSelectorComponent } from "@/components/region-selector";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState<string>("");

  return (
    <div className="w-screen flex">
      <RegionSelectorComponent
        open={open}
        setOpen={setOpen}
        locationName={locationName}
        setLocationName={setLocationName}
      />
      <HomepageMap
        setLocationName={setLocationName}
        locationName={locationName}
      />
    </div>
  );
}
