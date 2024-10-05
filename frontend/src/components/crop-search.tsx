"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import wheat from "@/assets/wheat.webp";
import corn from "@/assets/corn.jpeg";
import cotton from "@/assets/cotton.jpeg";
import rice from "@/assets/rice.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Crop {
  name: string;
  image: string;
}

export const crops: Crop[] = [
  { name: "Wheat", image: wheat },
  { name: "Corn", image: corn },
  { name: "Rice", image: rice },
  { name: "Cotton", image: cotton },
];

export function CropSearchComponent({
  handleCropSelect,
  selectedCrop,
}: {
  handleCropSelect: (value: string) => void;
  selectedCrop: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCrop
            ? crops.find((crop: Crop) => crop.name === selectedCrop)?.name
            : "Select crop..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search crop..." />
          <CommandList>
            <CommandEmpty>No Crops found.</CommandEmpty>
            <CommandGroup>
              {crops.map((crop: Crop) => (
                <CommandItem
                  key={crop.name}
                  value={crop.name}
                  onSelect={(currentValue) => {
                    handleCropSelect(
                      currentValue === selectedCrop ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                  className="flex justify-between"
                >
                  <div className="flex flex-row gap-2 items-center">
                    <img src={crop.image} className="rounded-full w-4 h-4" />
                    {crop.name}
                  </div>

                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCrop === crop.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
