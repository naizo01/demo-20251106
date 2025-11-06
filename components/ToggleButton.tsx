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
        w-[220px] h-[60px] rounded-full text-white font-bold text-lg
        transition-all duration-300 transform hover:scale-105 active:scale-95
        shadow-xl border-4
        ${
          isOn
            ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 border-pink-300 shadow-pink-300"
            : "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 border-gray-200 shadow-gray-300"
        }
        focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2
      `}
    >
      <span className="drop-shadow-md">{isOn ? "✨ ON ✨" : "💤 OFF"}</span>
    </button>
  );
}

