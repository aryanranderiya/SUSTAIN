import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocationType } from "@/pages/Home";
import { useNavigate } from "react-router-dom";

import corn from "@/assets/corn.jpeg";
import cotton from "@/assets/cotton.jpeg";
import rice from "@/assets/rice.jpg";
import millets from "@/assets/millets.jpg";
import wheat from "@/assets/wheat.webp";

interface Crop {
  name: string;
  image: string;
}

export const crops: Crop[] = [
  { name: "Wheat", image: wheat },
  { name: "Corn", image: corn },
  { name: "Rice", image: rice },
  { name: "Cotton", image: cotton },
  { name: "Millets", image: millets },
];

export function RegionSelectorComponent({
  open,
  setOpen,
  locationName,
  location,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  locationName: string;
  location: LocationType;
}) {
  const navigate = useNavigate();

  const handleSubmit = (cropName: string) => {
    if (location && cropName) {
      navigate(
        `/details?crop=${encodeURIComponent(cropName)}&lat=${
          location.latitude
        }&lon=${location.longitude}`
      );
    }
  };

  return (
    <>
      <div className="z-10 fixed bottom-4 left-0 w-full flex items-center justify-center">
        <div
          className={`rounded-[40px] bg-blue-500 hover:bg-blue-900 transition-all py-2 px-5 text-white shadow-2xl cursor-pointer outline shadow-black flex flex-col items-center select-none ${
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
            <DialogTitle>Select Crop for {locationName}</DialogTitle>
            <DialogDescription>
              Choose a crop to view detailed information for this region.
            </DialogDescription>
          </DialogHeader>
          {/* <CropSearchComponent
            handleCropSelect={handleCropSelect}
            selectedCrop={selectedCrop}
          /> */}
          <div className="flex flex-wrap gap-3 justify-center">
            {crops.map((crop) => (
              <div
                className="relative cursor-pointer"
                onClick={() => handleSubmit(crop.name)}
              >
                <img
                  src={crop.image}
                  className="max-w-[170px] min-w-[170px] aspect-square rounded-lg shadow-xl object-cover"
                />
                <div className="absolute p-1 bottom-0 w-full bg-opacity-80 backdrop-blur-sm bg-white justify-center flex rounded-lg rounded-t-none">
                  {crop.name}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
