"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CameraView from "@/components/CameraView";
import ToggleButton from "@/components/ToggleButton";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      <Header />
      
      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        <CameraView isOn={isOn} />
        <ToggleButton isOn={isOn} onClick={handleToggle} />
      </div>
      
      <Footer />
    </div>
  );
}

