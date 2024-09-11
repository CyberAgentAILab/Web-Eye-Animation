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

You can control the agent's behavior using JavaScript functions. These functions allow for manipulating the emotions and movement of the agent's eyes.

#### Emotions:
To change the agent's emotion, you can use the `eyes.emotion()` function. Here’s an example:

```javascript
eyes.emotion("surprise");
```

This function takes a string representing the emotion. Available emotions include:

- **joy**
- **sadness**
- **surprise**
- **anger**
- **fear**
- **disgust**
- **confusion**
- **love**
- **sleepy**
- **excitement**

Each of these emotions triggers a corresponding animation in the agent’s eyes.

#### Move:
To move the agent’s eyes to a specific pixel-based position on the screen, use the `eyes.move(x, y)` function:

```javascript
eyes.move(200, 300);
```

- **x**: The horizontal position (in pixels) from the left side of the screen.
- **y**: The vertical position (in pixels) from the top of the screen.

For example, calling `eyes.move(200, 300)` will move the eyes to a point 200 pixels to the right and 300 pixels down from the top-left corner of the screen.

#### Target:
To make the agent look at a specific point in 3D space relative to the screen, you can use the `eyes.target(x, y, z)` function:

```javascript
eyes.target(500, 0, 1000);
```

- **x**: The horizontal position of the target. The unit can be arbitrary, such as millimeters (mm), meters (m), or any other unit. Only the ratio between the values matters.
- **y**: The vertical position of the target. The unit is also arbitrary, and only the ratio to other values is important.
- **z**: The depth of the target, representing the distance from the screen to the target point. Again, the unit can be arbitrary.

For instance, `eyes.target(500, 0, 1000)` makes the agent look at a point 500 units to the right, aligned with the horizontal center of the screen, and 1000 units away from the screen.

This allows for precise control over where the agent "looks" based on coordinates in the 3D space, adding more depth to the agent's visual interaction.

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