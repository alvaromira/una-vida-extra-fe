import { createApp } from 'vue'
import store from './store/index.js'
import App from './App.vue'
import router from './router'
import axios from 'axios'

//axios.defaults.baseURL = "http://localhost:8000/api1/"
axios.defaults.headers.common["X-Request-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true;


//import base collection of css
import './assets/main.css'


//create the Vue app and mount it
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
