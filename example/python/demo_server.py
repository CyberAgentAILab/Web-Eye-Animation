#!/usr/bin/env python3
"""
Example: Simple WS server that sends eye target every 1s (up → down → right → left).
No camera; useful for testing web-eye-animation.js connection.
"""

import asyncio
import webbrowser

import websockets

DEMO_PAGE_URL = "https://cyberagentailab.github.io/Web-Eye-Animation/"

HOST = "0.0.0.0"
PORT = 8765
FOCAL_LENGTH = 1000
Z = 600
# 上, 下, 右, 左 (x, y)
DIRECTIONS = [(0, -400), (0, 400), (400, 0), (-400, 0)]
clients = set()


async def handler(ws):
    clients.add(ws)
    try:
        await ws.send("connected")
        async for _ in ws:
            pass
    finally:
        clients.discard(ws)


async def broadcast():
    idx = 0
    while True:
        x, y = DIRECTIONS[idx % 4]
        idx += 1
        msg = f"eye target {x} {y} {Z} {FOCAL_LENGTH}"
        for _ in range(30):  # 1秒間同じ方向を送信 (約30fps)
            await asyncio.sleep(1 / 30)
            if not clients:
                continue
            dead = set()
            for c in clients:
                if not (await send_safe(c, msg)):
                    dead.add(c)
            clients.difference_update(dead)


async def send_safe(client, msg):
    try:
        await client.send(msg)
        return True
    except Exception:
        return False


async def main():
    async with websockets.serve(handler, HOST, PORT):
        print(f"ws://{HOST}:{PORT}")
        webbrowser.open(DEMO_PAGE_URL)
        await broadcast()


if __name__ == "__main__":
    asyncio.run(main())
