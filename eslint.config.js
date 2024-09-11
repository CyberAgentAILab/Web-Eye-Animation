import js from "@eslint/js";
export default [
    js.configs.recommended,
    {
        files: ["*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                clearTimeout: "readonly",
                setTimeout: "readonly",
                clearInterval: "readonly",
                setInterval: "readonly",
                WebSocket: "readonly",
                console: "readonly",
				gsap: "readonly", 
            },
        },
        rules: {
            // カスタムルールをここに追加
            "semi": ["error", "always"],
            "quotes": ["error", "double"],
            "no-unused-vars": ["warn"],   // 未使用の変数に警告を表示
        },
    },
];
