import { createStore } from 'vuex';
import axios from 'axios';

//vuex store init
const store = createStore({
    state() {
        return {
            //userLoggedIn: false,
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
        /* logUserIn(state) {
             state.userLoggedIn = true;
         },
         logUserOut(state) {
             state.userLoggedIn = false;
         },*/
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
            return axios.get('http://localhost:8000/api1/user').then(({ data }) => {
                commit('SET_USER', data)
                commit('SET_AUTHENTICATED', true)

            }).catch(({ response }) => {
                console.log("Error, ", response)
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


export default store;