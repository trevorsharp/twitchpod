import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        twitch: "#9146FF",
      },
      ringWidth: {
        3: "3px",
      },
      screens: {
        tiny: "340px",
        mobile: "400px",
        normal: "470px",
      },
      fontSize: {
        base: "10px",
        tiny: "12px",
        mobile: "14px",
        normal: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
