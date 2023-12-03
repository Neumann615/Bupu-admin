import {defineConfig} from 'vite'
//@ts-ignore
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import Pages from 'vite-plugin-pages'

export default defineConfig({
    plugins: [react(), Pages({
        extendRoute(route, parent) {
            if (route.path === 'login' || route.path === "*") {
                // Index is unauthenticated.
                return route
            }
            // Augment the route with meta that indicates that the route requires authentication.
            return {
                ...route,
                meta: {auth: true},
            }
        }
    })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
        proxy: {
            "^/api": {
                target: "http://47.98.235.103:6060", // 真实接口地址, 后端给的基地址
                changeOrigin: true, // 允许跨域
                secure: false,  //关键参数，不懂的自己去查
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
