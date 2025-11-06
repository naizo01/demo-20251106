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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-8">
      <Header />

      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        <CameraView isOn={isOn} />
        <ToggleButton isOn={isOn} onClick={handleToggle} />
      </div>

      <Footer />
    </div>
  );
}

