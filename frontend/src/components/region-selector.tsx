"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CropSearchComponent } from "./crop-search";

const regions = [
  { name: "North Region", lat: 41.881832, lon: -87.623177 },
  { name: "South Region", lat: 29.749907, lon: -95.358421 },
  { name: "East Region", lat: 40.73061, lon: -73.935242 },
  { name: "West Region", lat: 34.052235, lon: -118.243683 },
];

interface RegionType {
  name: string;
  lat: number;
  lon: number;
}

export function RegionSelectorComponent({
  open,
  setOpen,
  locationName,
}: {
  locationName: string;
}) {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<RegionType | null>();
  // const [selectedRegion, setSelectedRegion] = useState<RegionType | null>(null);
  const [selectedCrop, setSelectedCrop] = useState("");

  const handleRegionSelect = (region: RegionType) => {
    setSelectedRegion(region);
    setOpen(true);
  };

  const handleCropSelect = (value: string) => {
    setSelectedCrop(value);
  };

  const handleSubmit = () => {
    if (selectedRegion && selectedCrop) {
      navigate(
        `/details?crop=${encodeURIComponent(selectedCrop)}&lat=${
          selectedRegion.lat
        }&lon=${selectedRegion.lon}`
      );
    }
  };

  return (
    <>
      <div className="z-10 fixed bottom-4 left-0 w-full flex items-center justify-center">
        <div
          className={`rounded-[40px] bg-blue-500 py-2 px-5 text-white shadow-2xl cursor-pointer outline shadow-black flex flex-col items-center select-none ${
            locationName.length <= 0 ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => setOpen(true)}
        >
          <span className="font-bold">View Information</span>
          <span className="text-xs">of</span>
          <span className="text-sm font-semibold w-72 text-center">
            {locationName}
          </span>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Crop for {selectedRegion?.name}</DialogTitle>
            <DialogDescription>
              Choose a crop to view detailed information for this region.
            </DialogDescription>
          </DialogHeader>
          <CropSearchComponent
            handleCropSelect={handleCropSelect}
            selectedCrop={selectedCrop}
          />
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={!selectedCrop}>
              View Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
