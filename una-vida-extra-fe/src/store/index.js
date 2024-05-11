import { createStore } from 'vuex';
import { ref } from "vue";
import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend
const baseUrl = import.meta.env.VITE_BASE_URL; //ruta base para el cliente de la aplicacion

//vuex store init
const store = createStore({
    state() {
        return {
            //userLoggedIn: false,
            userIsAdmin: false,
            authenticated: false,
            user: {},
            toasts: [],
            productResults: [],
            productCategories: [],
            productTags: []
        };
    },
    getters: {
        authenticated(state) {
            return state.authenticated;
        },
        user(state) {
            return state.user;
        },
        getProductResults(state) {
            return state.productResults;
        },

        getProductCategories(state) {
            return state.productCategories;
        },
        getProductTags(state) {
            return state.productTags;
        }
    },
    mutations: {
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
        },
        setProductResults(state, results) {
            state.productResults = results;
        },
        setProductCategories(state, categories) {
            state.productCategories = categories;
        },
        setProductTags(state, tags) {
            state.productTags = tags;
        }
    },
    actions: {
        async login({ commit }, { payload }) {
            try {
                // Get CSRF cookie
                await axios.get(`${baseUrl}/sanctum/csrf-cookie`);

                // Login request
                const response = await axios.post(baseApiUrl + "/login", payload);

                // Get user data, if the login is successful
                const userData = await axios.get(baseApiUrl + "/user");

                // Commit mutations
                commit('SET_AUTHENTICATED', true);
                commit('SET_USER', userData.data.data); // the response is a user object wrapped in data

                // Check if the user is admin
                if (userData.data.data.user_is_admin) {
                    commit('SET_USER_IS_ADMIN', true);
                }
            } catch (error) {
                console.error("Error:", error.response);
                // Handle error
                commit('SET_USER', {});
                commit('SET_AUTHENTICATED', false);
                commit('SET_USER_IS_ADMIN', false);
                // Re-throw the error so that the caller can handle it as well, if necessary
                throw error;
            }
        },
        async logout({ commit }) {
            try {
                await axios.post(baseApiUrl + "/logout");
                commit('SET_USER', {})
                commit('SET_AUTHENTICATED', false)
                commit('SET_USER_IS_ADMIN', false)
            } catch (error) {
                // Re-throw the error so that the caller can handle it as well, if necessary
                throw error;
            }

        },
        async getProductData({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}?include_tags=true`;
                const response = await axios.get(targetURL);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteProduct({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}`;
                const response = await axios.delete(targetURL);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteTag({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/tags/${id}`;
                const response = await axios.delete(targetURL);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async deleteCategory({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/categories/${id}`;
                const response = await axios.delete(targetURL);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async updateProductData({ commit }, { id, payload }) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}`;
                const response = await axios.put(targetURL, payload);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async updateTag({ commit }, { id, newname }) {
            try {
                const targetURL = `${baseApiUrl}/tags/${id}`;
                const response = await axios.put(targetURL, { "name": newname });
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async updateCategory({ commit }, { id, newname }) {
            try {
                const targetURL = `${baseApiUrl}/categories/${id}`;
                const response = await axios.put(targetURL, { "name": newname });
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async createTag({ commit }, { name }) {
            try {
                const targetURL = `${baseApiUrl}/tags`;
                const response = await axios.post(targetURL, { "name": name });
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async createCategory({ commit }, { name }) {
            try {
                const targetURL = `${baseApiUrl}/categories`;
                const response = await axios.post(targetURL, { "name": name });
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async getProductRequests({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}?include_tags=true&include_requests=true`;
                const response = await axios.get(targetURL);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async acceptProductRequest({ commit }, { payload }) {
            try {
                const targetURL = `${baseApiUrl}/requests/actions/accept`;
                const response = await axios.post(targetURL, payload);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async getUserProducts({ commit }, { userId, page }) {
            try {
                let targetURL = `${baseApiUrl}/users/${userId}/products`;

                if (page !== undefined && typeof page === 'number') {
                    targetURL += `?page=${page}`;
                }
                const response = await axios.get(targetURL);
                //commit('setProductResults', response.data);
                return response.data;
            } catch (error) {
                console.error('Error fetching user products:', error);
                throw error;
                // Handle error (e.g., show error message to user)
            }
        },
        async getAllUserRequestedProducts({ commit }, userId) {
            const userRequests = [];
            const currentPage = 1;
            while (true) {
                try {
                    let targetURL = `${baseApiUrl}/users/${userId}/requests?page=${currentPage}`;
                    const data = await axios.get(targetURL);
                    const requestObjects = data.data.data;
                    userRequests.push(...requestObjects); //se ponen las solicitudes en el array

                    // Si no hay siguiente pagina, salimos del bucle
                    if (!data.next_page_url) {
                        break;
                    }
                    // Tras hacer una pagina se sigue a la siguiente
                    currentPage++;
                } catch (error) {
                    console.error('Error fetching user requests:', error);
                    throw error;
                }
            }
            //tras terminar el bucle, se devuelve el array con las solicitudes
            return userRequests;
        },
        async getProducts({ commit }, page) {
            try {
                let targetURL = `${baseApiUrl}/products`;

                if (page !== undefined && typeof page === 'number') {
                    targetURL += `?page=${page}`;
                }
                const response = await axios.get(targetURL);
                commit('setProductResults', response.data);
                // return response.data;
            } catch (error) {
                console.error('Error fetching products:', error);
                throw error;
                // Handle error (e.g., show error message to user)
            }
        },
        async getProductCategories({ commit }) {
            try {
                let allCategories = []; // Array to store all tags from all pages

                let nextPage = `${baseApiUrl}/categories`; // Start with the first page

                while (nextPage) {
                    // Fetch data from the next page
                    const response = await axios.get(nextPage);
                    // Add tags from the current page to the array
                    allCategories = allCategories.concat(response.data.data);

                    // Check if there's a next page
                    nextPage = response.data.links.next;
                }
                commit('setProductCategories', allCategories);
            } catch (error) {
                console.error('Error fetching product categories:', error);
                throw error;
            }


        },
        async getProductTags({ commit }) {
            try {
                let allTags = []; // Array to store all tags from all pages

                let nextPage = `${baseApiUrl}/tags`; // Start with the first page

                while (nextPage) {
                    // Fetch data from the next page
                    const response = await axios.get(nextPage);
                    // Add tags from the current page to the array
                    allTags = allTags.concat(response.data.data);

                    // Check if there's a next page
                    nextPage = response.data.links.next;
                }
                commit('setProductTags', allTags);
            } catch (error) {
                console.error('Error fetching product tags:', error);
                throw error;
            }
        },
        async searchProducts({ commit }, q) {
            try {
                const targetURL = `${baseApiUrl}/products/search?search=${q}`;
                const response = await axios.get(targetURL);
                commit('setProductResults', response.data);
                // return response.data;
            } catch (error) {
                console.error('Error searching products:', error);
                throw error;
                // Handle error (e.g., show error message to user)
            }
        },
        async forgotPassword({ commit }, { email }) {
            try {
                const csrf = await axios.get(`${baseUrl}/sanctum/csrf-cookie`); //including potential new csrf token, since non registered or logged in users may not have it

                const targetURL = `${baseApiUrl}/forgot-password`;
                const response = await axios.post(targetURL, { "email": email });

            } catch (error) {
                throw error;
            }
        },
        async resetPassword({ commit }, { payload }) {
            //the payload should consist of token, email, password and password_confirmation
            try {
                const csrf = await axios.get(`${baseUrl}/sanctum/csrf-cookie`); //including potential new csrf token, since non registered or logged in users may not have it
                const targetURL = `${baseApiUrl}/reset-password`;
                const response = await axios.post(targetURL, payload);
            } catch (error) {
                throw error;
            }
        },
        async getAuthUser({ commit }) {
            try {
                const response = await axios.get(`${baseApiUrl}/user`);

                // Check for 401 (Unauthorized) or 419 (Authentication Timeout) status codes
                if (response.status === 401 || response.status === 419) {
                    commit('SET_USER', {});
                    commit('SET_AUTHENTICATED', false);
                    commit('SET_USER_IS_ADMIN', false);
                    console.log("No valid session");
                    //throw new Error("No valid session");
                }

                console.log("calling getAuthUser");
                console.log(response.data.data);

                // Commit mutations
                commit('SET_USER', response.data.data); //the response is a user object wrapped in data
                commit('SET_AUTHENTICATED', true);

                // Check if the user is admin
                if (response.data.data.user_is_admin) {
                    commit('SET_USER_IS_ADMIN', true);
                }
            } catch (error) {
                //console.error("Error:", error);

                // Handle other errors
                commit('SET_USER', {});
                commit('SET_AUTHENTICATED', false);
                commit('SET_USER_IS_ADMIN', false);

                // Re-throw the error so that the caller can handle it as well, if necessary
                //throw error;
            }
        },
        async updateUserDetails({ commit }, { id, payload }) {
            try {
                const targetURL = `${baseApiUrl}/users/${id}`;
                const response = await axios.put(targetURL, payload);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },
        async getUserContactDetails({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/users/${id}`;
                const response = await axios.get(targetURL);
                const details = {
                    "email": response.data.data.email,
                    "phone": response.data.data.phone
                }
                return details;

            } catch (error) {
                throw error;
            }
        }
    }

});


export default store;