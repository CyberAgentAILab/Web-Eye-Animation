# Eye-Agent JavaScript Library

This JavaScript library allows you to display a simple eye-only agent on the web. It supports various features such as expressing emotions, blinking, and directing the gaze. You can control the agent either through JavaScript commands or by sending instructions via a secure WebSocket connection.

## Features
- Emotion Expression: The agent can express different emotions, providing a more interactive and engaging experience.
- Blinking: The agent can blink at specified intervals or randomly, adding a more lifelike appearance.
- Gaze Direction: You can control the direction of the agent's gaze, making it follow certain elements or point towards specific areas.

## Installation
To include this library in your project, simply add the following script tag to your HTML file:

```
<div class="eye-container"></div>
<script src="https://cyberagentailab.github.io/Web-Eye-Animation/web-eye-animation.js"></script>
```

## Usage
### Basic Setup
Here's an example of how to set up the agent on your webpage:

```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eye animation capable of expressing multiple emotions and blinking</title>
</head>
<body>
    <div class="eye-container"></div>
    <script src="https://cyberagentailab.github.io/Web-Eye-Animation/web-eye-animation.js"></script>
</body>
</html>
```

### Controlling the Agent via JavaScript
You can control the agent's behavior using JavaScript functions. For example:

```
eyes.emotion("surprise");
```
Available emotions include joy, sadness, surprise, anger, fear, disgust, confusion, love, sleepy, and excitement.

### Controlling the Agent via WebSocket
To control the agent via WebSocket, connect to the server using a secure WebSocket connection and send commands. The web-eye-animation functions as a secure WebSocket client.
```
eyes.websocket("localhost")
```
To connect, you need to have a secure WebSocket server running separately.

- emotion [emotion type]: Expresses the specified emotion. For available emotion types, refer to the "Controlling the Agent via JavaScript" section.
- eye target [x] [y] [z] [focal length]: Directs the gaze to a specific 3D coordinate on the screen. The focal length represents the focus distance, with a default value of 1000. Any unit of measurement can be used, but the units for x, y, z, and focal length should be consistent.
- eye [x] [y] [flag_rect]: Specifies the coordinates on the screen where the eyes should be positioned. If flag_rect is True, the values of x and y should range from 0 to 1. If False, the values are in pixels.

### License
This project is licensed under the MIT License, allowing you to freely use, modify, and distribute it for both personal and commercial purposes.

### Contributing
Contributions are welcome! Please fork this repository and submit a pull request with your changes.

### Contact
If you have any questions or need support, feel free to open an issue or contact us at ohira_yoshiki@cyberagent.co.jp.