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
  // ONの状態で、顔が検出されている場合のみタケコプターを表示
  if (!isOn || !faceDetected || !facePosition) {
    return null;
  }

  // 顔の位置に基づいてタケコプターを配置
  // ミラー表示のため、x座標を反転
  // facePosition.xは顔の中心X座標、facePosition.yは頭の真ん中のY座標
  // タケコプターのサイズを顔の幅に基づいて調整（顔の大きさに応じてスケール）
  const iconSize = Math.max(60, Math.min(120, facePosition.width * 0.7));
  
  // ミラー反転: 顔の中心X座標を反転して、頭の真ん中に配置
  const x = canvasWidth - facePosition.x;
  // facePosition.yは既に頭の真ん中の位置なので、そのまま使用
  // タケコプターの中心が頭の真ん中に来るように調整
  const y = facePosition.y - iconSize / 2;

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        left: `${x - iconSize / 2}px`,
        top: `${y}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        transition: "left 0.1s ease-out, top 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out",
      }}
    >
      <Image
        src="/takekop.png"
        alt="タケコプター"
        width={iconSize}
        height={iconSize}
        className="w-full h-full object-contain drop-shadow-2xl"
        priority
        unoptimized
      />
    </div>
  );
}

