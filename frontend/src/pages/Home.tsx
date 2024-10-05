import HomepageMap from "@/components/Map/HomepageMap";
import { RegionSelectorComponent } from "@/components/region-selector";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-screen flex">
      <RegionSelectorComponent open={open} setOpen={setOpen} />
      <HomepageMap open={open} setOpen={setOpen} />
    </div>
  );
}
