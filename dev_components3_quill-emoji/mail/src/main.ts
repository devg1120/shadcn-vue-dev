import { createApp } from 'vue'
import './style.css'
import './assets/css/fonts.css'
import './assets/css/main.css'
import './assets/css/themes.css'
import App from './App.vue'

import { useColorMode } from '@vueuse/core'

const mode = useColorMode("dark")
mode.value =  "light";
mode.value =  "dark";

createApp(App).mount('#app')
