"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
  FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";
import HelicopterOverlay from "./HelicopterOverlay";

interface CameraViewProps {
  isOn: boolean;
}

// 顔メッシュの接続情報（主要な接続のみ）
const FACE_MESH_CONNECTIONS = [
  // 輪郭
  [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389],
  [389, 356], [356, 454], [454, 323], [323, 361], [361, 288], [288, 397],
  [397, 365], [365, 379], [379, 378], [378, 400], [400, 377], [377, 152],
  [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172],
  [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162],
  [162, 21], [21, 54], [54, 103], [103, 67], [67, 109], [109, 10],
  // 左目
  [33, 7], [7, 163], [163, 144], [144, 145], [145, 153], [153, 154],
  [154, 155], [155, 133], [133, 173], [173, 157], [157, 158], [158, 159],
  [159, 160], [160, 161], [161, 246], [246, 33],
  // 右目
  [263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381],
  [381, 382], [382, 362], [362, 398], [398, 384], [384, 385], [385, 386],
  [386, 387], [387, 388], [388, 466], [466, 263],
  // 鼻
  [1, 2], [2, 5], [5, 4], [4, 6], [6, 19], [19, 20], [20, 94],
  [94, 2], [2, 98], [98, 97], [97, 2], [2, 326], [326, 327],
  // 口
  [61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314],
  [314, 405], [405, 320], [320, 307], [307, 375], [375, 321], [321, 308],
  [308, 324], [324, 318], [318, 61],
  // 眉
  [107, 55], [55, 65], [65, 52], [52, 53], [53, 46], [46, 107],
  [336, 296], [296, 334], [334, 293], [293, 300], [300, 276], [276, 336],
];

export default function CameraView({ isOn }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // 顔メッシュを描画する関数
  const drawFaceMesh = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 1;

    // ランドマーク点を描画
    landmarks.forEach((landmark) => {
      const x = landmark.x * width;
      const y = landmark.y * height;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "#00ff00";
      ctx.fill();
    });

    // 接続線を描画（あみあみ）
    FACE_MESH_CONNECTIONS.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        ctx.beginPath();
        ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
        ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
        ctx.stroke();
      }
    });
  };

  // 顔検出と描画のループ
  const detectFace = () => {
    // コンポーネントがアンマウントされている場合は停止
    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(detectFace);
      return;
    }

    // ビデオが準備できていない場合はスキップ
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(detectFace);
      return;
    }

    try {
      const results: FaceLandmarkerResult =
        faceLandmarkerRef.current.detectForVideo(video, performance.now());

      // Canvasをクリア
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        setFaceDetected(true);

        // 最初の顔のランドマークを取得
        const landmarks = results.faceLandmarks[0];

        // 顔メッシュを描画
        drawFaceMesh(ctx, landmarks, canvas.width, canvas.height);

        // 顔のバウンディングボックスを計算（頭の位置を計算するため）
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;

        landmarks.forEach((landmark) => {
          minX = Math.min(minX, landmark.x);
          minY = Math.min(minY, landmark.y);
          maxX = Math.max(maxX, landmark.x);
          maxY = Math.max(maxY, landmark.y);
        });

        // 頭の上の位置を計算（顔の上部中央）
        const faceWidth = (maxX - minX) * canvas.width;
        const faceHeight = (maxY - minY) * canvas.height;
        const faceCenterX = ((minX + maxX) / 2) * canvas.width;
        const faceTopY = minY * canvas.height;

        setFacePosition({
          x: faceCenterX,
          y: faceTopY - faceHeight * 0.3, // 顔の上に少しオフセット
          width: faceWidth,
          height: faceHeight,
        });
      } else {
        setFaceDetected(false);
        setFacePosition(null);
      }
    } catch (err) {
      // エラーが発生してもループを継続（一時的なエラーの可能性）
      console.error("顔検出エラー:", err);
    }

    // 次のフレームをリクエスト
    animationFrameRef.current = requestAnimationFrame(detectFace);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;
    let metadataHandler: (() => void) | null = null;

    const setup = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // カメラへのアクセスをリクエスト
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (!isMounted || !videoRef.current || !canvasRef.current) {
          // コンポーネントがアンマウントされた場合はストリームを停止
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // ストリームを設定
        video.srcObject = stream;

        // Canvasサイズをビデオに合わせる（loadedmetadataイベントで処理）
        metadataHandler = () => {
          if (!isMounted || !video || !canvas) return;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        };
        video.addEventListener("loadedmetadata", metadataHandler);

        // ビデオの再生（エラーハンドリング付き）
        try {
          await video.play();
        } catch (playError) {
          // play()エラーを無視（ストリームが既に停止されている場合など）
          console.warn("ビデオ再生エラー（無視）:", playError);
          if (!isMounted) return;
        }

        if (!isMounted) {
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          return;
        }

        // MediaPipe Face Landmarkerの初期化
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (!isMounted) {
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          return;
        }

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: false,
          runningMode: "VIDEO" as const,
          numFaces: 1,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!isMounted) {
          faceLandmarker.close();
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          return;
        }

        faceLandmarkerRef.current = faceLandmarker;
        setIsLoading(false);

        // 顔検出ループを開始
        detectFace();
      } catch (err) {
        console.error("初期化エラー:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "初期化に失敗しました"
          );
          setIsLoading(false);
        }
        // エラー時もストリームをクリーンアップ
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };

    setup();

    // クリーンアップ
    return () => {
      isMounted = false;

      // アニメーションフレームをキャンセル
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // ビデオ要素のクリーンアップ
      if (videoRef.current) {
        const video = videoRef.current;
        if (metadataHandler) {
          video.removeEventListener("loadedmetadata", metadataHandler);
        }
        video.srcObject = null;
        video.pause();
      }

      // ストリームの停止
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        stream = null;
      }

      // FaceLandmarkerのクリーンアップ
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
        faceLandmarkerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-[640px] h-auto aspect-[4/3] rounded-3xl shadow-2xl bg-white overflow-hidden border-8 border-white">
      {/* カメラ映像 */}
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
          <div className="text-center text-purple-600">
            <svg
              className="w-24 h-24 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-lg font-bold mb-2">エラーが発生しました</p>
            <p className="text-sm text-purple-500">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }} // ミラー表示
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: "scaleX(-1)" }} // ミラー表示
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-600 bg-opacity-40 z-20 backdrop-blur-sm">
              <div className="text-center text-white bg-white bg-opacity-20 rounded-3xl px-8 py-6 backdrop-blur-md border-2 border-white border-opacity-40">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                <p className="text-base font-bold">カメラに接続中...</p>
              </div>
            </div>
          )}
          {!faceDetected && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-500 bg-opacity-20 z-10 pointer-events-none">
              <p className="text-purple-800 text-base font-bold bg-white bg-opacity-90 px-6 py-3 rounded-full shadow-lg border-4 border-purple-200">
                顔をカメラに向けてください
              </p>
            </div>
          )}
        </>
      )}

      {/* タケコプター画像のオーバーレイ */}
      <HelicopterOverlay
        isOn={isOn}
        facePosition={facePosition}
        faceDetected={faceDetected}
      />
    </div>
  );
}

