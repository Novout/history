import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'uno.css'
import './reset.css'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
