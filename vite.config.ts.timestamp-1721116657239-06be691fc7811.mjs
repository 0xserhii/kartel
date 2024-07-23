// vite.config.ts
import path from "path";
import react from "file:///F:/Work/My%20work/kartel/kartel-frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///F:/Work/My%20work/kartel/kartel-frontend/node_modules/vite/dist/node/index.js";
import dotenv from "file:///F:/Work/My%20work/kartel/kartel-frontend/node_modules/dotenv/lib/main.js";
import obfuscator from "file:///F:/Work/My%20work/kartel/kartel-frontend/node_modules/rollup-plugin-obfuscator/dist/rollup-plugin-obfuscator.js";
import babel from "file:///F:/Work/My%20work/kartel/kartel-frontend/node_modules/vite-plugin-babel/dist/index.mjs";
var __vite_injected_original_dirname = "F:\\Work\\My work\\kartel\\kartel-frontend";
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [react(), babel()],
  server: {
    port: 3e3,
    host: "0.0.0.0"
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true
        // drop_debugger: true
      },
      mangle: true,
      output: {
        comments: false
        // Remove comments
      }
    },
    rollupOptions: {
      plugins: [
        obfuscator({
          options: {
            // optionsPreset: "high-obfuscation", // or 'default', 'low-obfuscation'
            // compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            // debugProtection: true,
            // debugProtectionInterval: 3000,
            disableConsoleOutput: true,
            identifierNamesGenerator: "hexadecimal",
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: ["rc4"],
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
          }
        })
      ]
    }
  },
  define: {
    "process.env": JSON.stringify(process.env)
    // Provide process.env to the client
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxXb3JrXFxcXE15IHdvcmtcXFxca2FydGVsXFxcXGthcnRlbC1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcV29ya1xcXFxNeSB3b3JrXFxcXGthcnRlbFxcXFxrYXJ0ZWwtZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1dvcmsvTXklMjB3b3JrL2thcnRlbC9rYXJ0ZWwtZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCBvYmZ1c2NhdG9yIGZyb20gXCJyb2xsdXAtcGx1Z2luLW9iZnVzY2F0b3JcIjtcbmltcG9ydCBiYWJlbCBmcm9tIFwidml0ZS1wbHVnaW4tYmFiZWxcIjtcblxuZG90ZW52LmNvbmZpZygpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgYmFiZWwoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAvLyBkcm9wX2RlYnVnZ2VyOiB0cnVlXG4gICAgICB9LFxuICAgICAgbWFuZ2xlOiB0cnVlLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGNvbW1lbnRzOiBmYWxzZSwgLy8gUmVtb3ZlIGNvbW1lbnRzXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBvYmZ1c2NhdG9yKHtcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAvLyBvcHRpb25zUHJlc2V0OiBcImhpZ2gtb2JmdXNjYXRpb25cIiwgLy8gb3IgJ2RlZmF1bHQnLCAnbG93LW9iZnVzY2F0aW9uJ1xuICAgICAgICAgICAgLy8gY29tcGFjdDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xGbG93RmxhdHRlbmluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xGbG93RmxhdHRlbmluZ1RocmVzaG9sZDogMC43NSxcbiAgICAgICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZGVhZENvZGVJbmplY3Rpb25UaHJlc2hvbGQ6IDAuNCxcbiAgICAgICAgICAgIC8vIGRlYnVnUHJvdGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIC8vIGRlYnVnUHJvdGVjdGlvbkludGVydmFsOiAzMDAwLFxuICAgICAgICAgICAgZGlzYWJsZUNvbnNvbGVPdXRwdXQ6IHRydWUsXG4gICAgICAgICAgICBpZGVudGlmaWVyTmFtZXNHZW5lcmF0b3I6IFwiaGV4YWRlY2ltYWxcIixcbiAgICAgICAgICAgIGxvZzogZmFsc2UsXG4gICAgICAgICAgICBudW1iZXJzVG9FeHByZXNzaW9uczogdHJ1ZSxcbiAgICAgICAgICAgIHJlbmFtZUdsb2JhbHM6IGZhbHNlLFxuICAgICAgICAgICAgc2VsZkRlZmVuZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIHNpbXBsaWZ5OiB0cnVlLFxuICAgICAgICAgICAgc3BsaXRTdHJpbmdzOiB0cnVlLFxuICAgICAgICAgICAgc3BsaXRTdHJpbmdzQ2h1bmtMZW5ndGg6IDEwLFxuICAgICAgICAgICAgc3RyaW5nQXJyYXk6IHRydWUsXG4gICAgICAgICAgICBzdHJpbmdBcnJheUVuY29kaW5nOiBbXCJyYzRcIl0sXG4gICAgICAgICAgICBzdHJpbmdBcnJheVRocmVzaG9sZDogMC43NSxcbiAgICAgICAgICAgIHVuaWNvZGVFc2NhcGVTZXF1ZW5jZTogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIGRlZmluZToge1xuICAgIFwicHJvY2Vzcy5lbnZcIjogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYpLCAvLyBQcm92aWRlIHByb2Nlc3MuZW52IHRvIHRoZSBjbGllbnRcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULE9BQU8sVUFBVTtBQUNqVSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sV0FBVztBQUxsQixJQUFNLG1DQUFtQztBQU96QyxPQUFPLE9BQU87QUFFZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxNQUVoQjtBQUFBLE1BQ0EsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLFFBQ04sVUFBVTtBQUFBO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQLFdBQVc7QUFBQSxVQUNULFNBQVM7QUFBQTtBQUFBO0FBQUEsWUFHUCx1QkFBdUI7QUFBQSxZQUN2QixnQ0FBZ0M7QUFBQSxZQUNoQyxtQkFBbUI7QUFBQSxZQUNuQiw0QkFBNEI7QUFBQTtBQUFBO0FBQUEsWUFHNUIsc0JBQXNCO0FBQUEsWUFDdEIsMEJBQTBCO0FBQUEsWUFDMUIsS0FBSztBQUFBLFlBQ0wsc0JBQXNCO0FBQUEsWUFDdEIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFlBQ2YsVUFBVTtBQUFBLFlBQ1YsY0FBYztBQUFBLFlBQ2QseUJBQXlCO0FBQUEsWUFDekIsYUFBYTtBQUFBLFlBQ2IscUJBQXFCLENBQUMsS0FBSztBQUFBLFlBQzNCLHNCQUFzQjtBQUFBLFlBQ3RCLHVCQUF1QjtBQUFBLFVBQ3pCO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLEtBQUssVUFBVSxRQUFRLEdBQUc7QUFBQTtBQUFBLEVBQzNDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
