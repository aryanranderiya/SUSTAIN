import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Wheat } from "lucide-react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div className="w-full flex justify-between fixed left-0 top-0 p-[1em] z-10 bg-white bg-opacity-25 backdrop-blur-lg">
      <Link to={"/"}>
        <span className="font-bold text-black hover:underline flex gap-1">
          SUSTAIN <Wheat width={17} />
        </span>
      </Link>
      <HamburgerMenuIcon width={20} height={20} className="cursor-pointer" />
    </div>
  );
}
