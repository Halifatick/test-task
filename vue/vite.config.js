import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

const config = defineConfig(
    ({mode}) => ({
        base: "/test-task/",
        plugins: [
            vue(),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: 'brotliCompress',
                ext: '.br',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            port: 3000,
            open: true,
            cors: true,
            hmr: {
                overlay: false,
            },
        },
    })
)

export default config