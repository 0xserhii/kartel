import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';


dotenv.config();

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  define: {
    'process.env': JSON.stringify(process.env) // Provide process.env to the client
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
