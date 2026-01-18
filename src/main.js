import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 导入中文语言包
import 'element-plus/dist/index.css'
import router from './router'
import './style.css'
import './assets/main.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn }) // 使用中文语言包
app.mount('#app')
