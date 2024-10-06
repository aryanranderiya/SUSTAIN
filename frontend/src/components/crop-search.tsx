// Define the Crop type
type Crop = {
  name: string;
  // You can add other properties as needed, e.g., image URL
  image?: string;
};

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

type CropSearchComponentProps = {
  handleCropSelect: (value: string) => void;
  selectedCrop: string;
  crops: Crop[];
};

export function CropSearchComponent({
  handleCropSelect,
  selectedCrop,
  crops, // Accept crops as a prop
}: CropSearchComponentProps) {
  const [open, setOpen] = useState(false); // State for popover open/close

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
            ? crops.find((crop) => crop.name === selectedCrop)?.name
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
              {crops.map((crop) => (
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
