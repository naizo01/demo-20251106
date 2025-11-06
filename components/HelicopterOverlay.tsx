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
      className="w-full h-full drop-shadow-lg animate-bounce-slow"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* プロペラの軸 */}
      <rect
        x="47"
        y="55"
        width="6"
        height="25"
        rx="3"
        fill="#FF69B4"
        stroke="#FF1493"
        strokeWidth="2"
      />

      {/* プロペラ本体（回転） */}
      <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px' }}>
        {/* プロペラ1 */}
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="8"
          fill="url(#gradient1)"
          opacity="0.9"
        />
        {/* プロペラ2（90度回転） */}
        <ellipse
          cx="50"
          cy="50"
          rx="8"
          ry="45"
          fill="url(#gradient2)"
          opacity="0.9"
        />
      </g>

      {/* 中心の丸 */}
      <circle cx="50" cy="50" r="12" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="3" />
      <circle cx="50" cy="50" r="6" fill="#FFF" stroke="#FF1493" strokeWidth="2" />

      {/* グラデーション定義 */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#FF69B4', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#FFB6C1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF69B4', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#DDA0DD', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#EE82EE', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#DDA0DD', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}

