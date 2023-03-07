import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//import base collection of css
import './assets/main.css'

//create the Vue app and mount it
const app = createApp(App);
app.use(router);
app.mount('#app');
