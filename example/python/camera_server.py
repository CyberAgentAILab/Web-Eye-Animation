#!/usr/bin/env python3
"""
Example: WebSocket server for eye tracking.

Uses the camera to detect faces and sends "eye target x y z focalLength"
to connected clients (web-eye-animation.js). Requires OpenCV.
"""

import argparse
import asyncio
import logging
import webbrowser

import cv2
import websockets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEMO_PAGE_URL = "https://cyberagentailab.github.io/Web-Eye-Animation/"

# Constants (virtual 3D space, mm)
SCREEN_WIDTH = 1920
SCREEN_HEIGHT = 1080
FOCAL_LENGTH = 1000
DEFAULT_DISTANCE = 600

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
cap = None
connected_clients = set()


def calculate_gaze_direction(face_rect, frame_width, frame_height):
    """Compute gaze (x, y, z) in mm from face rect (x, y, w, h)."""
    x, y, w, h = face_rect
    face_center_x = x + w / 2
    face_center_y = y + h / 2
    normalized_x = (face_center_x / frame_width) - 0.5
    normalized_y = (face_center_y / frame_height) - 0.5
    face_x = normalized_x * SCREEN_WIDTH
    face_y = normalized_y * SCREEN_HEIGHT
    avg_face_width = 140
    estimated_distance = (
        (avg_face_width / w) * FOCAL_LENGTH if w > 0 else DEFAULT_DISTANCE
    )
    # 左右反転（カメラが鏡像のため、目の動きが直感的になる）
    return -face_x, face_y, estimated_distance


def process_frame(frame):
    """Return (x, y, z) gaze in mm for first detected face, or None."""
    h, w, _ = frame.shape
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )
    if len(faces) == 0:
        return None
    return calculate_gaze_direction(faces[0], w, h)


async def handle_client(websocket):
    """Handle one WebSocket client (websockets 12+ passes only connection)."""
    connected_clients.add(websocket)
    logger.info("Client connected: %s", websocket.remote_address)
    try:
        await websocket.send("connected")
        async for _ in websocket:
            pass
    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as e:
        logger.error("Error in handle_client: %s", e)
    finally:
        connected_clients.discard(websocket)
        logger.info("Client disconnected")


async def camera_loop():
    """Read camera, detect face, send eye target to all clients."""
    global cap
    if cap is None or not cap.isOpened():
        logger.error("Camera not available")
        return
    logger.info("Starting camera loop...")
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                await asyncio.sleep(0.1)
                continue
            gaze_result = process_frame(frame)
            if gaze_result and connected_clients:
                x, y, z = gaze_result
                msg = f"eye target {x:.2f} {y:.2f} {z:.2f} {FOCAL_LENGTH}"
                disconnected = set()
                for client in connected_clients:
                    try:
                        await client.send(msg)
                    except websockets.exceptions.ConnectionClosed:
                        disconnected.add(client)
                    except Exception as e:
                        logger.error("Send error: %s", e)
                        disconnected.add(client)
                connected_clients.difference_update(disconnected)
            await asyncio.sleep(1.0 / 30.0)
    except asyncio.CancelledError:
        raise
    except Exception as e:
        logger.error("Camera loop: %s", e)
        raise


async def main():
    parser = argparse.ArgumentParser(description="WebSocket server for eye tracking")
    parser.add_argument("--host", default="localhost", help="Bind host")
    parser.add_argument("--port", type=int, default=8765, help="Bind port")
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    args = parser.parse_args()

    global cap
    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        logger.error("Failed to open camera %s", args.camera)
        return
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    logger.info("ws://%s:%s", args.host, args.port)
    async with websockets.serve(handle_client, args.host, args.port):
        webbrowser.open(DEMO_PAGE_URL)
        await camera_loop()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
    finally:
        if cap is not None:
            cap.release()
        cv2.destroyAllWindows()
