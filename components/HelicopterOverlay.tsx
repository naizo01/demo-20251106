"use client";

interface HelicopterOverlayProps {
  isOn: boolean;
  facePosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  faceDetected: boolean;
}

export default function HelicopterOverlay({
  isOn,
  facePosition,
  faceDetected,
}: HelicopterOverlayProps) {
  if (!isOn) {
    return null;
  }

  // 顔が検出されていない場合は固定位置に表示
  if (!faceDetected || !facePosition) {
    return (
      <div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ width: "80px", height: "80px" }}
      >
        <HelicopterIcon />
      </div>
    );
  }

  // 顔の位置に基づいてタケコプターを配置
  // ミラー表示のため、x座標を反転
  const containerWidth = 640; // CameraViewの幅
  const iconSize = Math.max(60, Math.min(100, facePosition.width * 0.6));
  const x = containerWidth - facePosition.x; // ミラー反転
  const y = facePosition.y;

  return (
    <div
      className="absolute z-10 transition-all duration-100"
      style={{
        left: `${x - iconSize / 2}px`,
        top: `${y - iconSize * 0.8}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`,
      }}
    >
      <HelicopterIcon />
    </div>
  );
}

// タケコプターアイコンコンポーネント
function HelicopterIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ヘリコプターのボディ */}
      <rect x="20" y="40" width="60" height="30" rx="5" fill="#3B82F6" />
      {/* コックピット */}
      <ellipse cx="35" cy="45" rx="8" ry="10" fill="#60A5FA" />
      {/* メインローター */}
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="40"
        stroke="#1E40AF"
        strokeWidth="3"
      />
      <line
        x1="30"
        y1="20"
        x2="70"
        y2="20"
        stroke="#1E40AF"
        strokeWidth="2"
      />
      {/* テールローター */}
      <line
        x1="80"
        y1="55"
        x2="90"
        y2="55"
        stroke="#1E40AF"
        strokeWidth="2"
      />
      <line
        x1="85"
        y1="50"
        x2="85"
        y2="60"
        stroke="#1E40AF"
        strokeWidth="2"
      />
      {/* 着陸装置 */}
      <line
        x1="25"
        y1="70"
        x2="25"
        y2="75"
        stroke="#1E40AF"
        strokeWidth="2"
      />
      <line
        x1="75"
        y1="70"
        x2="75"
        y2="75"
        stroke="#1E40AF"
        strokeWidth="2"
      />
    </svg>
  );
}

