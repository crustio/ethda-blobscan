import type { Config } from "tailwindcss";

import baseConfig from "@blobscan/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],

  presets: [baseConfig],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        mo: { max: "900px" },
      },
    },
  },
} satisfies Config;
