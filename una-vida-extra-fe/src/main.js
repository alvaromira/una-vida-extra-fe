import { createApp } from 'vue'
import { createStore } from 'vuex';
import App from './App.vue'
import router from './router'

//import base collection of css
import './assets/main.css'

//vuex store init
const store = createStore({
    state() {
        return {
            userLoggedIn: false,
            userIsAdmin: true,
        };
    },
    mutations: {
        logUserIn(state) {
            state.userLoggedIn = true;
        },
        logUserOut(state) {
            state.userLoggedIn = false;
        },
        setUserIsAdmin(state, status) {
            state.userIsAdmin = status
        }
    }
});

//create the Vue app and mount it
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
