# 🚁 タケコプターDemo

顔認識機能とタケコプター画像を重ねて表示するWebアプリケーションのモックUI。

## 📋 プロジェクト概要

Phase 1ではロジックを実装せず、見た目のみを実装しています。

## 🛠 技術スタック

- Next.js 14.x
- React 18.x
- TypeScript 5.x
- Tailwind CSS 3.x

## 🚀 セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📁 プロジェクト構造

```
demo-20251106/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── Header.tsx          # ヘッダーコンポーネント
│   ├── CameraView.tsx      # カメラ映像表示コンポーネント
│   ├── HelicopterOverlay.tsx # タケコプター画像オーバーレイ
│   ├── ToggleButton.tsx    # ON/OFF切り替えボタン
│   └── Footer.tsx          # フッターコンポーネント
└── SCREEN_DESIGN.md        # 画面設計書
```

## 🎨 機能

- Webカメラのプレビュー表示（Phase 1ではプレースホルダー）
- タケコプター画像の表示/非表示切り替え
- ON/OFFボタンによる状態管理

## 📝 今後の実装予定（Phase 2）

- 実際のWebカメラ接続
- MediaPipeによる顔認識
- タケコプター画像の動的配置（顔の上に表示）

## 📄 ライセンス

© naizo

