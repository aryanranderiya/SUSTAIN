import { Wheat } from "lucide-react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div className="w-full flex justify-center fixed left-0 top-0 p-[1em] z-50 bg-white bg-opacity-70 backdrop-blur-lg">
      <Link to={"/"}>
        <span className="font-bold text-black hover:underline flex gap-1 text-xl">
          SUSTAIN <Wheat width={17} />
        </span>
      </Link>
      {/* <HamburgerMenuIcon width={20} height={20} className="cursor-pointer" /> */}
    </div>
  );
}
