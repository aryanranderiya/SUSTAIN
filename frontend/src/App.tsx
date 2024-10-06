import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Details from "./pages/Details";
import Home, { LocationType } from "./pages/Home";
import { LlmChat } from "./components/llm-chat";
import { useState } from "react";

function App() {
  const [locationName, setLocationName] = useState<string>("");
  const [location, setLocation] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });

  return (
    <>
      <Navbar />
      <LlmChat locationName={locationName} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              location={location}
              setLocation={setLocation}
              locationName={locationName}
              setLocationName={setLocationName}
            />
          }
        />
        <Route path="/details" element={<Details />} />
      </Routes>
    </>
  );
}

export default App;
