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
            optionsPreset: "high-obfuscation",
            // or 'default', 'low-obfuscation'
            compact: true,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxXb3JrXFxcXE15IHdvcmtcXFxca2FydGVsXFxcXGthcnRlbC1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcV29ya1xcXFxNeSB3b3JrXFxcXGthcnRlbFxcXFxrYXJ0ZWwtZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1dvcmsvTXklMjB3b3JrL2thcnRlbC9rYXJ0ZWwtZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IG9iZnVzY2F0b3IgZnJvbSBcInJvbGx1cC1wbHVnaW4tb2JmdXNjYXRvclwiO1xyXG5pbXBvcnQgYmFiZWwgZnJvbSBcInZpdGUtcGx1Z2luLWJhYmVsXCI7XHJcblxyXG5kb3RlbnYuY29uZmlnKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBiYWJlbCgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxyXG4gICAgICAgIC8vIGRyb3BfZGVidWdnZXI6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgbWFuZ2xlOiB0cnVlLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjb21tZW50czogZmFsc2UsIC8vIFJlbW92ZSBjb21tZW50c1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIG9iZnVzY2F0b3Ioe1xyXG4gICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBvcHRpb25zUHJlc2V0OiAnaGlnaC1vYmZ1c2NhdGlvbicsIC8vIG9yICdkZWZhdWx0JywgJ2xvdy1vYmZ1c2NhdGlvbidcclxuICAgICAgICAgICAgY29tcGFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgY29udHJvbEZsb3dGbGF0dGVuaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmdUaHJlc2hvbGQ6IDAuNzUsXHJcbiAgICAgICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBkZWFkQ29kZUluamVjdGlvblRocmVzaG9sZDogMC40LFxyXG4gICAgICAgICAgICAvLyBkZWJ1Z1Byb3RlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIC8vIGRlYnVnUHJvdGVjdGlvbkludGVydmFsOiAzMDAwLFxyXG4gICAgICAgICAgICBkaXNhYmxlQ29uc29sZU91dHB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgaWRlbnRpZmllck5hbWVzR2VuZXJhdG9yOiBcImhleGFkZWNpbWFsXCIsXHJcbiAgICAgICAgICAgIGxvZzogZmFsc2UsXHJcbiAgICAgICAgICAgIG51bWJlcnNUb0V4cHJlc3Npb25zOiB0cnVlLFxyXG4gICAgICAgICAgICByZW5hbWVHbG9iYWxzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2VsZkRlZmVuZGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2ltcGxpZnk6IHRydWUsXHJcbiAgICAgICAgICAgIHNwbGl0U3RyaW5nczogdHJ1ZSxcclxuICAgICAgICAgICAgc3BsaXRTdHJpbmdzQ2h1bmtMZW5ndGg6IDEwLFxyXG4gICAgICAgICAgICBzdHJpbmdBcnJheTogdHJ1ZSxcclxuICAgICAgICAgICAgc3RyaW5nQXJyYXlFbmNvZGluZzogW1wicmM0XCJdLFxyXG4gICAgICAgICAgICBzdHJpbmdBcnJheVRocmVzaG9sZDogMC43NSxcclxuICAgICAgICAgICAgdW5pY29kZUVzY2FwZVNlcXVlbmNlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBcInByb2Nlc3MuZW52XCI6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KSwgLy8gUHJvdmlkZSBwcm9jZXNzLmVudiB0byB0aGUgY2xpZW50XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1QsT0FBTyxVQUFVO0FBQ2pVLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBTGxCLElBQU0sbUNBQW1DO0FBT3pDLE9BQU8sT0FBTztBQUVkLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLE1BRWhCO0FBQUEsTUFDQSxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1AsV0FBVztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1AsZUFBZTtBQUFBO0FBQUEsWUFDZixTQUFTO0FBQUEsWUFDVCx1QkFBdUI7QUFBQSxZQUN2QixnQ0FBZ0M7QUFBQSxZQUNoQyxtQkFBbUI7QUFBQSxZQUNuQiw0QkFBNEI7QUFBQTtBQUFBO0FBQUEsWUFHNUIsc0JBQXNCO0FBQUEsWUFDdEIsMEJBQTBCO0FBQUEsWUFDMUIsS0FBSztBQUFBLFlBQ0wsc0JBQXNCO0FBQUEsWUFDdEIsZUFBZTtBQUFBLFlBQ2YsZUFBZTtBQUFBLFlBQ2YsVUFBVTtBQUFBLFlBQ1YsY0FBYztBQUFBLFlBQ2QseUJBQXlCO0FBQUEsWUFDekIsYUFBYTtBQUFBLFlBQ2IscUJBQXFCLENBQUMsS0FBSztBQUFBLFlBQzNCLHNCQUFzQjtBQUFBLFlBQ3RCLHVCQUF1QjtBQUFBLFVBQ3pCO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLEtBQUssVUFBVSxRQUFRLEdBQUc7QUFBQTtBQUFBLEVBQzNDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
