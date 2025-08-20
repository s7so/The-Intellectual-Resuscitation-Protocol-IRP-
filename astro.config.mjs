import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [
    tailwind({
      // Apply Tailwind base styles globally
      applyBaseStyles: true,
    }),
  ],
  server: {
    port: 4321,
  },
});
