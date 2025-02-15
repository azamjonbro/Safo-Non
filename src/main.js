import { createApp } from 'vue'
import App from './App.vue'
import Toast from 'vue-toastification';
import "vue-toastification/dist/index.css";
import  router  from './Router';
import './assets/CSS/style.css'
createApp(App)
.use(router)
.use(Toast)    
.mount('#app')
