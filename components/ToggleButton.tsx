"use client";

interface ToggleButtonProps {
  isOn: boolean;
  onClick: () => void;
}

export default function ToggleButton({ isOn, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[200px] h-[50px] rounded-full text-white font-medium
        transition-colors duration-200
        ${isOn ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 hover:bg-gray-500"}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      {isOn ? "🚁 ON" : "🚁 OFF"}
    </button>
  );
}

