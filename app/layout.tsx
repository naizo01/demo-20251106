import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "タケコプターDemo",
  description: "顔認識機能とタケコプター画像を重ねて表示するWebアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

