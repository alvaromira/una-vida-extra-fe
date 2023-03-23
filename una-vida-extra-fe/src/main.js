import { createApp } from 'vue'
import { createStore } from 'vuex';
import App from './App.vue'
import router from './router'
import axios from 'axios'

//import base collection of css
import './assets/main.css'

//vuex store init
const store = createStore({
    state() {
        return {
            userLoggedIn: true,
            userIsAdmin: false,
            authenticated: false,
            user: {}
        };
    },
    getters: {
        authenticated(state) {
            return state.authenticated
        },
        user(state) {
            return state.user
        }
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
        },
        SET_AUTHENTICATED(state, value) {
            state.authenticated = value
        },
        SET_USER(state, value) {
            state.user = value
        },
    },
    actions: {
        login({ commit }) {
            return axios.get('/api/user').then(({ data }) => {
                commit('SET_USER', data)
                commit('SET_AUTHENTICATED', true)
                router.push({ name: 'dashboard' })
            }).catch(({ response: { data } }) => {
                commit('SET_USER', {})
                commit('SET_AUTHENTICATED', false)
            })
        },
        logout({ commit }) {
            commit('SET_USER', {})
            commit('SET_AUTHENTICATED', false)
        }
    }

});

//create the Vue app and mount it
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
