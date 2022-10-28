import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ProviderPlugin } from "vue-directive-providers";
import Toast, { POSITION } from "vue-toastification";
import 'uno.css'
import './reset.css'
import "vue-toastification/dist/index.css";
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(ProviderPlugin)
  .use(Toast, {
    position: POSITION.TOP_CENTER,
    timeout: 3000
  })
  .mount('#app')
