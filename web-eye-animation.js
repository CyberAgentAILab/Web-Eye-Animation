(function() {
    // CSSを動的に生成して追加する関数
    function addCSS() {
        const style = document.createElement("style");
        style.textContent = `
            .eye-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100vw; /* 横幅を50%に設定 */
                height: 100vh; /* 縦幅を50%に設定 */
                background-color: black;
            }
            
            .eye {
                position: absolute;
                width: 10vw;
                height: 25vh;
                background-color: white;
                border-radius: 50%;
                top: 50%; /* 縦方向の中央に配置 */
                transform: translateY(-50%);
            }
            
            #leftEye {
                left: 20%; /* eye-container内の左側に配置 */
            }
            
            #rightEye {
                right: 20%; /* eye-container内の右側に配置 */
            }
        `;
        document.head.appendChild(style);
    }
    
    // CSSが読み込まれていない場合、動的にCSSを追加
    if (!document.querySelector("style")) {
        addCSS();
    }

    const eyeContainer = document.querySelector(".eye-container");
    if (!eyeContainer) return;

    const leftEye = document.createElement("div");
    leftEye.id = "leftEye";
    leftEye.className = "eye";

    const rightEye = document.createElement("div");
    rightEye.id = "rightEye";
    rightEye.className = "eye";

    eyeContainer.appendChild(leftEye);
    eyeContainer.appendChild(rightEye);

    const eyeElements = [leftEye, rightEye];
    let currentX = 0;
    let currentY = 0;
    let isAnimating = false;
    let blinkTimeoutId = null;
    let ws;
    let reconnectInterval = 5000; // 再接続の間隔（ミリ秒）
    let reconnectIntervalId;

    // GSAPの読み込み
    function loadGSAP(callback) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js";
        script.onload = callback;
        document.head.appendChild(script);
    }

    function expressEmotion(animationFunction) {
        if (isAnimating) return;
        isAnimating = true;
        const timeline = animationFunction();
        timeline.then(() => {
            isAnimating = false;
            scheduleBlink();
        });
    }

    function expressJoy() {
        return gsap.timeline()
            .to(eyeElements, { borderRadius: "0%", rotate: 45, scaleY: 0.1, duration: 0.2 })
            .to(eyeElements, { y: "-=10", duration: 0.1, yoyo: true, repeat: 3 })
            .to(eyeElements, { borderRadius: "50%", rotate: 0, scaleY: 1, duration: 0.2 });
    }

    function expressSadness() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 0.1, duration: 0.5 })
            .to(eyeElements, { y: "+=10", duration: 0.5 })
            .to(eyeElements, { scaleX: 1.5, duration: 0.5 })
            .to(eyeElements, { scaleX: 1, scaleY: 1, duration: 0.5 })
            .to(eyeElements, { y: "-=10", duration: 0.5 });
    }

    function expressSurprise() {
        return gsap.timeline()
            .to(eyeElements, { scaleX: 1.5, scaleY: 1.5, duration: 0.2 })
            .to(eyeElements, { scaleX: 1, scaleY: 1, duration: 0.3, delay: 0.5 });
    }

    function expressAnger() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 0.5, rotate: -10, duration: 0.2 })
            .to(eyeElements, { x: "+=10", duration: 0.1, yoyo: true, repeat: 3 })
            .to(eyeElements, { scaleY: 1, rotate: 0, duration: 0.2 });
    }

    function expressFear() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 1.5, duration: 0.2 })
            .to(eyeElements, { y: "-=10", duration: 0.2 })
            .to(eyeElements, { scaleX: 0.8, duration: 0.1, yoyo: true, repeat: 5 })
            .to(eyeElements, { scaleY: 1, scaleX: 1, duration: 0.2 })
            .to(eyeElements, { y: "+=10", duration: 0.2 });
    }

    function expressDisgust() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 0.3, rotate: -5, duration: 0.3 })
            .to(eyeElements, { y: "+=10", duration: 0.3 })
            .to(eyeElements, { scaleY: 1, rotate: 0, duration: 0.3, delay: 0.5 })
            .to(eyeElements, { y: "-=10", duration: 0.3 });
    }

    function expressConfusion() {
        return gsap.timeline()
            .to(leftEye, { rotate: -20, duration: 0.2 })
            .to(rightEye, { rotate: 20, duration: 0.2 }, "<")
            .to(eyeElements, { y: "+=10", duration: 0.1, yoyo: true, repeat: 3 })
            .to(eyeElements, { rotate: 0, duration: 0.2 });
    }

    function expressLove() {
        return gsap.timeline()
            .to(eyeElements, { borderRadius: "0 0 50% 50%", scaleY: 0.5, duration: 0.2 })
            .to(eyeElements, { scaleX: 1.2, scaleY: 0.4, duration: 0.2 })
            .to(eyeElements, { scaleX: 1, scaleY: 1, borderRadius: "50%", duration: 0.2, delay: 0.5 });
    }

    function expressSleepy() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 0.3, duration: 0.5 })
            .to(eyeElements, { y: "+=10", duration: 0.5 })
            .to(eyeElements, { scaleY: 0.1, duration: 0.2, delay: 0.5 })
            .to(eyeElements, { scaleY: 0.3, duration: 0.2 })
            .to(eyeElements, { scaleY: 1, duration: 0.5 })
            .to(eyeElements, { y: "-=10", duration: 0.5 });
    }

    function expressExcitement() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 1.2, scaleX: 1.2, duration: 0.2 })
            .to(eyeElements, { y: "-=10", duration: 0.1, yoyo: true, repeat: 5 })
            .to(eyeElements, { rotate: 360, duration: 0.5 })
            .to(eyeElements, { scaleY: 1, scaleX: 1, duration: 0.2 })
            .to(eyeElements, { rotate: 0, duration: 0.1 });
    }

    loadGSAP();

    function singleBlink() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 0.1, duration: 0.1 })
            .to(eyeElements, { scaleY: 1, duration: 0.1 });
    }

    function doubleBlink() {
        return gsap.timeline()
            .to(eyeElements, { scaleY: 0.1, duration: 0.1 })
            .to(eyeElements, { scaleY: 1, duration: 0.1 })
            .to(eyeElements, { scaleY: 0.1, duration: 0.1, delay: 0.1 })
            .to(eyeElements, { scaleY: 1, duration: 0.1 });
    }

    function blink() {
        if (isAnimating) {
            scheduleBlink();
            return;
        }
        const blinkType = Math.random();
        let timeline;

        if (blinkType < 0.6) {
            timeline = singleBlink();
        } else {
            timeline = doubleBlink();
        }

        timeline.then(scheduleBlink);
    }

    function scheduleBlink() {
        if (blinkTimeoutId) {
            clearTimeout(blinkTimeoutId);
        }
        blinkTimeoutId = setTimeout(blink, Math.random() * 5000 + 1000);
    }

    function moveEyes(x, y, reg = false) {
        const rect = eyeContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
    
        // 正規化された座標が与えられた場合、ピクセル単位に変換
        if (reg) {
            x = x * window.innerWidth;
            y = y * window.innerHeight;
        }
    
        const deltaX = (x - centerX);
        const deltaY = (y - centerY);
    
        gsap.to(eyeElements, {
            x: deltaX,
            y: deltaY,
            duration: 0.3
        });
    
        currentX = deltaX;
        currentY = deltaY;
    }

    function moveEyesTarget(x, y, z, focalLength = 1000) {
    
        // 3D空間のベクトルを2Dスクリーン平面に投影
        const projectedX = (x / (z + focalLength)) * window.innerWidth / 2;
        const projectedY = (y / (z + focalLength)) * window.innerHeight / 2;
    
        // スクリーン平面での動きの大きさを調整
        const deltaX = (projectedX);
        const deltaY = (projectedY);        
    
        // 目の動きを反映
        gsap.to(eyeElements, {
            x: deltaX,
            y: deltaY,
            duration: 0.3
        });
    
        currentX = deltaX;
        currentY = deltaY;
    }
    

    function resetEyes() {
        gsap.to(eyeElements, {
            x: 0,
            y: 0,
            duration: 0.5
        });

        currentX = 0;
        currentY = 0;
    }

    // マウスムーブイベントをリッスンして目を動かす
    document.addEventListener("mousemove", (event) => {
        const rect = eyeContainer.getBoundingClientRect();
        const isInContainer = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        if (isInContainer) {
            moveEyes(event.clientX, event.clientY);
        } else {
            resetEyes();
        }
    });

    // 初期化時にブリンクのスケジュールを開始
    scheduleBlink();

    // WebSocketクライアントの設定
    function startWebSocket(ip_address) {
        // 既存のWebSocket接続が存在する場合、それをクローズする
        if (ws && ws.readyState !== WebSocket.CLOSED) {
            ws.close();
        }

        ws = new WebSocket(`wss://${ip_address}:8765`);

        ws.onopen = function(event) {
            console.log("WebSocket connection established");
            clearInterval(reconnectIntervalId); // 接続が確立されたら再接続タイマーを停止
        };

        ws.onmessage = function(event) {
            const message = event.data;

            // Parse the received message
            console.log(message);
            const parts = message.split(" ");

            if (parts[0] === "emotion") {
                eyes.emotion(parts[1]);  // 呼び出しを変更
            } else if (parts[0] === "eye" && parts[1] === "target" && parts.length === 6) {
                // parts[2] = x, parts[3] = y, parts[4] = z, parts[5] = focalLength
                const x = parseFloat(parts[2]);
                const y = parseFloat(parts[3]);
                const z = parseFloat(parts[4]);
                const focalLength = parseFloat(parts[5]);
                if (!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(focalLength)) {
                    moveEyesTarget(x, y, z, focalLength);
                } else {
                    console.log("Invalid eye target coordinates or focalLength:", parts);
                }
            } else if (parts[0] === "eye" && parts.length === 3) {
                const x = parseFloat(parts[1]);
                const y = parseFloat(parts[2]);
                const rect = eyeContainer.getBoundingClientRect();
                if (!isNaN(x) && !isNaN(y)) {
                    moveEyes(x * rect.width, y * rect.height);
                } else {
                    console.log("Invalid eye coordinates:", parts[1], parts[2]);
                }
            }
        };

        ws.onclose = function(event) {
            console.log("WebSocket connection closed");
            scheduleReconnect(ip_address); // 接続が閉じられたら再接続をスケジュール
        };

        ws.onerror = function(event) {
            console.error("WebSocket error:", event);
            scheduleReconnect(ip_address); // エラーが発生したら再接続をスケジュール
        };
    }

    function scheduleReconnect(ip_address) {
        // 既に再接続がスケジュールされている場合は何もしない
        if (reconnectIntervalId) {
            return;
        }

        console.log(`Attempting to reconnect in ${reconnectInterval / 1000} seconds...`);
        reconnectIntervalId = setInterval(() => {
            if (ws.readyState === WebSocket.CLOSED) {
                startWebSocket(ip_address);
            } else {
                clearInterval(reconnectIntervalId); // 接続が確立されたら再接続タイマーを停止
                reconnectIntervalId = null;
            }
        }, reconnectInterval);
    }

    // WebSocket接続を開始するためのグローバル関数を設定
    window.eyes = {
        websocket: startWebSocket,
        emotion: function(emotion) {
            switch (emotion) {
                case "joy":
                    expressEmotion(expressJoy);
                    break;
                case "sadness":
                    expressEmotion(expressSadness);
                    break;
                case "surprise":
                    expressEmotion(expressSurprise);
                    break;
                case "anger":
                    expressEmotion(expressAnger);
                    break;
                case "fear":
                    expressEmotion(expressFear);
                    break;
                case "disgust":
                    expressEmotion(expressDisgust);
                    break;
                case "confusion":
                    expressEmotion(expressConfusion);
                    break;
                case "love":
                    expressEmotion(expressLove);
                    break;
                case "sleepy":
                    expressEmotion(expressSleepy);
                    break;
                case "excitement":
                    expressEmotion(expressExcitement);
                    break;
                default:
                    console.log("Unknown emotion:", emotion);
            }
        }
    };
})();