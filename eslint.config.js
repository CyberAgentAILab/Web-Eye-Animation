export default [
	{
	  files: ["*.js"],
	  languageOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	  },
	  rules: {
		// Add your custom rules here
		"semi": ["error", "always"],
		"quotes": ["error", "double"],
	  },
	},
  ];
  