# Example: Python WebSocket servers

Web-Eye-Animation 用の **Python サンプル**です。ブラウザの `web-eye-animation.js` に `eye target` を送る WS サーバーを2種類用意しています。

## セットアップ

```bash
cd example/python
pip install -r requirements.txt
```

- `websockets` … WebSocket サーバー
- `opencv-python` … カメラ＋顔検出（`camera_server.py` のみ）
- `numpy` … 数値計算（`camera_server.py` のみ）

## サンプル一覧

| ファイル | 説明 | 用途 |
|----------|------|------|
| **camera_server.py** | カメラで顔検出し、視線方向を送信 | 実機での視線追従デモ |
| **demo_server.py** | 1秒ごとに上・下・右・左の目線を送信 | 接続テスト・デモ用 |

### camera_server.py（カメラ＋顔検出）

```bash
python camera_server.py
# オプション: --host localhost --port 8765 --camera 0
```

- カメラを開き、顔を検出して `eye target x y z focalLength` を送信
- 起動時に [デモページ](https://cyberagentailab.github.io/Web-Eye-Animation/) をブラウザで開く
- ページのコンソールで `eyes.websocket("localhost", 8765, "ws")` を実行して接続

### demo_server.py（簡易デモ）

```bash
python demo_server.py
```

- 証明書なしの平文 WS。1秒ごとに上→下→右→左の目線を送る
- 起動時に [デモページ](https://cyberagentailab.github.io/Web-Eye-Animation/) をブラウザで開く
- ページのコンソールで `eyes.websocket("localhost", 8765, "ws")` を実行して接続

## メッセージ形式

クライアント（web-eye-animation.js）が解釈する形式:

```
eye target [x] [y] [z] [focalLength]
```

- `x`, `y`, `z`: 3D 空間の視線先（単位は任意、比だけ重要）
- `focalLength`: 焦点距離（例: 1000）

## 注意

- いずれも **サンプル実装**です
- `camera_server.py` はカメラ権限が必要です
- 複数クライアントの同時接続に対応しています
