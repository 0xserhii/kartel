// vite.config.ts
import path from 'path';
import react from 'file:///E:/prom/casino-website/kartel/node_modules/@vitejs/plugin-react-swc/index.mjs';
import { defineConfig } from 'file:///E:/prom/casino-website/kartel/node_modules/vite/dist/node/index.js';
import dotenv from 'file:///E:/prom/casino-website/kartel/node_modules/dotenv/lib/main.js';
import obfuscator from 'file:///E:/prom/casino-website/kartel/node_modules/rollup-plugin-obfuscator/dist/rollup-plugin-obfuscator.js';
import babel from 'file:///E:/prom/casino-website/kartel/node_modules/vite-plugin-babel/dist/index.mjs';
var __vite_injected_original_dirname = 'E:\\prom\\casino-website\\kartel';
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [react(), babel()],
  server: {
    port: 3e3,
    host: '0.0.0.0'
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
            // optionsPreset: 'high-obfuscation', // or 'default', 'low-obfuscation'
            // compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            // debugProtection: true,
            // debugProtectionInterval: 3000,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
          }
        })
      ]
    }
  },
  define: {
    'process.env': JSON.stringify(process.env)
    // Provide process.env to the client
  },
  resolve: {
    alias: {
      '@': path.resolve(__vite_injected_original_dirname, './src')
    }
  }
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9tXFxcXGNhc2luby13ZWJzaXRlXFxcXGthcnRlbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxccHJvbVxcXFxjYXNpbm8td2Vic2l0ZVxcXFxrYXJ0ZWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Byb20vY2FzaW5vLXdlYnNpdGUva2FydGVsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xuaW1wb3J0IG9iZnVzY2F0b3IgZnJvbSAncm9sbHVwLXBsdWdpbi1vYmZ1c2NhdG9yJztcbmltcG9ydCBiYWJlbCBmcm9tICd2aXRlLXBsdWdpbi1iYWJlbCc7XG5cbmRvdGVudi5jb25maWcoKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGJhYmVsKCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhvc3Q6ICcwLjAuMC4wJ1xuICB9LFxuICBidWlsZDoge1xuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgLy8gZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxuICAgICAgfSxcbiAgICAgIG1hbmdsZTogdHJ1ZSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBjb21tZW50czogZmFsc2UgLy8gUmVtb3ZlIGNvbW1lbnRzXG4gICAgICB9XG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIG9iZnVzY2F0b3Ioe1xuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIC8vIG9wdGlvbnNQcmVzZXQ6ICdoaWdoLW9iZnVzY2F0aW9uJywgLy8gb3IgJ2RlZmF1bHQnLCAnbG93LW9iZnVzY2F0aW9uJ1xuICAgICAgICAgICAgLy8gY29tcGFjdDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xGbG93RmxhdHRlbmluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xGbG93RmxhdHRlbmluZ1RocmVzaG9sZDogMC43NSxcbiAgICAgICAgICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxuICAgICAgICAgICAgZGVhZENvZGVJbmplY3Rpb25UaHJlc2hvbGQ6IDAuNCxcbiAgICAgICAgICAgIC8vIGRlYnVnUHJvdGVjdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIC8vIGRlYnVnUHJvdGVjdGlvbkludGVydmFsOiAzMDAwLFxuICAgICAgICAgICAgZGlzYWJsZUNvbnNvbGVPdXRwdXQ6IHRydWUsXG4gICAgICAgICAgICBpZGVudGlmaWVyTmFtZXNHZW5lcmF0b3I6ICdoZXhhZGVjaW1hbCcsXG4gICAgICAgICAgICBsb2c6IGZhbHNlLFxuICAgICAgICAgICAgbnVtYmVyc1RvRXhwcmVzc2lvbnM6IHRydWUsXG4gICAgICAgICAgICByZW5hbWVHbG9iYWxzOiBmYWxzZSxcbiAgICAgICAgICAgIHNlbGZEZWZlbmRpbmc6IHRydWUsXG4gICAgICAgICAgICBzaW1wbGlmeTogdHJ1ZSxcbiAgICAgICAgICAgIHNwbGl0U3RyaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIHNwbGl0U3RyaW5nc0NodW5rTGVuZ3RoOiAxMCxcbiAgICAgICAgICAgIHN0cmluZ0FycmF5OiB0cnVlLFxuICAgICAgICAgICAgc3RyaW5nQXJyYXlFbmNvZGluZzogWydyYzQnXSxcbiAgICAgICAgICAgIHN0cmluZ0FycmF5VGhyZXNob2xkOiAwLjc1LFxuICAgICAgICAgICAgdW5pY29kZUVzY2FwZVNlcXVlbmNlOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIF1cbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudic6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KSAvLyBQcm92aWRlIHByb2Nlc3MuZW52IHRvIHRoZSBjbGllbnRcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXG4gICAgfVxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVIsT0FBTyxVQUFVO0FBQ2xTLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBTGxCLElBQU0sbUNBQW1DO0FBT3pDLE9BQU8sT0FBTztBQUVkLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLE1BRWhCO0FBQUEsTUFDQSxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUE7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1AsV0FBVztBQUFBLFVBQ1QsU0FBUztBQUFBO0FBQUE7QUFBQSxZQUdQLHVCQUF1QjtBQUFBLFlBQ3ZCLGdDQUFnQztBQUFBLFlBQ2hDLG1CQUFtQjtBQUFBLFlBQ25CLDRCQUE0QjtBQUFBO0FBQUE7QUFBQSxZQUc1QixzQkFBc0I7QUFBQSxZQUN0QiwwQkFBMEI7QUFBQSxZQUMxQixLQUFLO0FBQUEsWUFDTCxzQkFBc0I7QUFBQSxZQUN0QixlQUFlO0FBQUEsWUFDZixlQUFlO0FBQUEsWUFDZixVQUFVO0FBQUEsWUFDVixjQUFjO0FBQUEsWUFDZCx5QkFBeUI7QUFBQSxZQUN6QixhQUFhO0FBQUEsWUFDYixxQkFBcUIsQ0FBQyxLQUFLO0FBQUEsWUFDM0Isc0JBQXNCO0FBQUEsWUFDdEIsdUJBQXVCO0FBQUEsVUFDekI7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsS0FBSyxVQUFVLFFBQVEsR0FBRztBQUFBO0FBQUEsRUFDM0M7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
