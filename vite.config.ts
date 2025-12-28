
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// تعريف متغير process لتجنب أخطاء TypeScript أثناء عملية البناء في البيئات غير المتوافقة مع Node
declare const process: any;

export default defineConfig({
  plugins: [react()],
  // تعيين base إلى './' يجعل المسارات نسبية، وهو أمر ضروري عند استخدام HashRouter
  // لضمان تحميل الملفات بشكل صحيح بغض النظر عن المسار الأساسي للموقع
  base: './',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
