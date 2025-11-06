"use client";

import Image from "next/image";

interface HelicopterOverlayProps {
  isOn: boolean;
  facePosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  faceDetected: boolean;
  canvasWidth: number;
}

export default function HelicopterOverlay({
  isOn,
  facePosition,
  faceDetected,
  canvasWidth,
}: HelicopterOverlayProps) {
  if (!isOn) {
    return null;
  }

  // 顔が検出されていない場合は固定位置に表示
  if (!faceDetected || !facePosition) {
    return (
      <div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ width: "80px", height: "80px" }}
      >
        <Image
          src="/takekop.png"
          alt="タケコプター"
          width={80}
          height={80}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </div>
    );
  }

  // 顔の位置に基づいてタケコプターを配置
  // ミラー表示のため、x座標を反転
  // facePosition.xは顔の中心X座標、facePosition.yは頭の真ん中のY座標
  // タケコプターのサイズを顔の幅に基づいて調整
  const iconSize = Math.max(60, Math.min(120, facePosition.width * 0.7));
  
  // ミラー反転: 顔の中心X座標を反転して、頭の真ん中に配置
  const x = canvasWidth - facePosition.x;
  // facePosition.yは既に頭の真ん中の位置なので、そのまま使用
  const y = facePosition.y;

  return (
    <div
      className="absolute z-20 transition-all duration-100 pointer-events-none"
      style={{
        left: `${x - iconSize / 2}px`,
        top: `${y}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`,
      }}
    >
      <Image
        src="/takekop.png"
        alt="タケコプター"
        width={iconSize}
        height={iconSize}
        className="w-full h-full object-contain drop-shadow-2xl"
        priority
      />
    </div>
  );
}

