import { createApp } from 'vue'; // Importar la función createApp de Vue
import store from './store/index.js'; // Importar la tienda (store) de Vuex
import App from './App.vue'; // Importar el componente principal de la aplicación
import router from './router'; // Importar el enrutador de la aplicación
import axios from 'axios'; // Importar Axios para hacer solicitudes HTTP

// Configuración predeterminada de las cabeceras de las solicitudes Axios
axios.defaults.headers.common["X-Request-With"] = "XMLHttpRequest"; // Establecer cabecera X-Request-With
axios.defaults.headers.common["Content-Type"] = "application/json"; // Establecer cabecera Content-Type
axios.defaults.headers.common["Accept"] = "application/json"; // Establecer cabecera Accept
axios.defaults.withCredentials = true; // Habilitar credenciales en las solicitudes Axios

// Importar la hoja de estilos principal de la aplicación
import './assets/main.css'; // Importar la hoja de estilos principal de la aplicación

// Crear la aplicación Vue y montarla en el elemento con el ID 'app'
const app = createApp(App); // Crear una instancia de la aplicación Vue
app.use(router); // Utilizar el enrutador en la aplicación Vue
app.use(store); // Utilizar la tienda Vuex en la aplicación Vue
app.mount('#app'); // Montar la aplicación en el elemento con el ID 'app' en el DOM
