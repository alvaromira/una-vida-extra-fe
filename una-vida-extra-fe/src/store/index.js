import { createStore } from 'vuex';
import axios from 'axios';

//vuex store init
const store = createStore({
    state() {
        return {
            //userLoggedIn: false,
            userIsAdmin: false,
            authenticated: false,
            user: {},
            toasts: []
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
        SET_USER_IS_ADMIN(state, status) {
            state.userIsAdmin = status
        },
        SET_AUTHENTICATED(state, value) {
            state.authenticated = value
        },
        SET_USER(state, value) {
            state.user = value
        },
        addToast(state, toast) {
            state.toasts.push(toast);
        },
        clearToast(state, title) {
            const index = state.toasts.findIndex((toast) => toast.title === title); // find toast
            state.toasts.splice(index, 1); // remove toast from array
        }
    },
    actions: {
        login({ commit }) {
            return axios.get('http://localhost:8000/api1/user').then(({ data }) => {
                commit('SET_USER', data.data) //the response is a user object wrapped in data
                commit('SET_AUTHENTICATED', true)
                if (data.data.user_is_admin) {
                    commit('SET_USER_IS_ADMIN', true)
                }

            }).catch(({ response }) => {
                console.log("Error, ", response)
                commit('SET_USER', {})
                commit('SET_AUTHENTICATED', false)
                commit('SET_USER_IS_ADMIN', false)
            })
        },
        logout({ commit }) {
            commit('SET_USER', {})
            commit('SET_AUTHENTICATED', false)
            commit('SET_USER_IS_ADMIN', false)
        }
    }

});


export default store;