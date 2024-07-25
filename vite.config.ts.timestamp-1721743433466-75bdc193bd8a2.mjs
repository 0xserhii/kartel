// vite.config.ts
import path from "path";
import react from "file:///E:/prom/casino-website/kartel/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///E:/prom/casino-website/kartel/node_modules/vite/dist/node/index.js";
import dotenv from "file:///E:/prom/casino-website/kartel/node_modules/dotenv/lib/main.js";
import obfuscator from "file:///E:/prom/casino-website/kartel/node_modules/rollup-plugin-obfuscator/dist/rollup-plugin-obfuscator.js";
import babel from "file:///E:/prom/casino-website/kartel/node_modules/vite-plugin-babel/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\prom\\casino-website\\kartel";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9tXFxcXGNhc2luby13ZWJzaXRlXFxcXGthcnRlbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxccHJvbVxcXFxjYXNpbm8td2Vic2l0ZVxcXFxrYXJ0ZWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Byb20vY2FzaW5vLXdlYnNpdGUva2FydGVsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XHJcbmltcG9ydCBvYmZ1c2NhdG9yIGZyb20gXCJyb2xsdXAtcGx1Z2luLW9iZnVzY2F0b3JcIjtcclxuaW1wb3J0IGJhYmVsIGZyb20gXCJ2aXRlLXBsdWdpbi1iYWJlbFwiO1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgYmFiZWwoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICBjb21wcmVzczoge1xyXG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICAvLyBkcm9wX2RlYnVnZ2VyOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmdsZTogdHJ1ZSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgY29tbWVudHM6IGZhbHNlLCAvLyBSZW1vdmUgY29tbWVudHNcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBvYmZ1c2NhdG9yKHtcclxuICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgLy8gb3B0aW9uc1ByZXNldDogXCJoaWdoLW9iZnVzY2F0aW9uXCIsIC8vIG9yICdkZWZhdWx0JywgJ2xvdy1vYmZ1c2NhdGlvbidcclxuICAgICAgICAgICAgLy8gY29tcGFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmdUaHJlc2hvbGQ6IDAuNzUsXHJcbiAgICAgICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBkZWFkQ29kZUluamVjdGlvblRocmVzaG9sZDogMC40LFxyXG4gICAgICAgICAgICAvLyBkZWJ1Z1Byb3RlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIC8vIGRlYnVnUHJvdGVjdGlvbkludGVydmFsOiAzMDAwLFxyXG4gICAgICAgICAgICBkaXNhYmxlQ29uc29sZU91dHB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgaWRlbnRpZmllck5hbWVzR2VuZXJhdG9yOiBcImhleGFkZWNpbWFsXCIsXHJcbiAgICAgICAgICAgIGxvZzogZmFsc2UsXHJcbiAgICAgICAgICAgIG51bWJlcnNUb0V4cHJlc3Npb25zOiB0cnVlLFxyXG4gICAgICAgICAgICByZW5hbWVHbG9iYWxzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2VsZkRlZmVuZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2ltcGxpZnk6IHRydWUsXHJcbiAgICAgICAgICAgIHNwbGl0U3RyaW5nczogdHJ1ZSxcclxuICAgICAgICAgICAgc3BsaXRTdHJpbmdzQ2h1bmtMZW5ndGg6IDEwLFxyXG4gICAgICAgICAgICBzdHJpbmdBcnJheTogdHJ1ZSxcclxuICAgICAgICAgICAgc3RyaW5nQXJyYXlFbmNvZGluZzogW1wicmM0XCJdLFxyXG4gICAgICAgICAgICBzdHJpbmdBcnJheVRocmVzaG9sZDogMC43NSxcclxuICAgICAgICAgICAgdW5pY29kZUVzY2FwZVNlcXVlbmNlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBcInByb2Nlc3MuZW52XCI6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KSwgLy8gUHJvdmlkZSBwcm9jZXNzLmVudiB0byB0aGUgY2xpZW50XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVIsT0FBTyxVQUFVO0FBQ2xTLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBTGxCLElBQU0sbUNBQW1DO0FBT3pDLE9BQU8sT0FBTztBQUVkLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLE1BRWhCO0FBQUEsTUFDQSxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1AsV0FBVztBQUFBLFVBQ1QsU0FBUztBQUFBO0FBQUE7QUFBQSxZQUdQLHVCQUF1QjtBQUFBLFlBQ3ZCLGdDQUFnQztBQUFBLFlBQ2hDLG1CQUFtQjtBQUFBLFlBQ25CLDRCQUE0QjtBQUFBO0FBQUE7QUFBQSxZQUc1QixzQkFBc0I7QUFBQSxZQUN0QiwwQkFBMEI7QUFBQSxZQUMxQixLQUFLO0FBQUEsWUFDTCxzQkFBc0I7QUFBQSxZQUN0QixlQUFlO0FBQUEsWUFDZixlQUFlO0FBQUEsWUFDZixVQUFVO0FBQUEsWUFDVixjQUFjO0FBQUEsWUFDZCx5QkFBeUI7QUFBQSxZQUN6QixhQUFhO0FBQUEsWUFDYixxQkFBcUIsQ0FBQyxLQUFLO0FBQUEsWUFDM0Isc0JBQXNCO0FBQUEsWUFDdEIsdUJBQXVCO0FBQUEsVUFDekI7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsS0FBSyxVQUFVLFFBQVEsR0FBRztBQUFBO0FBQUEsRUFDM0M7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
