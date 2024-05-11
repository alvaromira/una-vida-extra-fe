import { createStore } from 'vuex';
import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL; //ruta base para la api del backend
const baseUrl = import.meta.env.VITE_BASE_URL; //ruta base para el cliente de la aplicacion

//inicializacion del vuex store, con todas las propiedades del estado que se usan en diversas partes y vistas de la app
const store = createStore({
    state() {
        // Devuelve el estado de la aplicación.
        return {
            userIsAdmin: false, // Indica si el usuario es un administrador o no
            authenticated: false, // Indica si el usuario está autenticado o no
            user: {}, // Almacena los datos del usuario
            toasts: [], // Almacena mensajes de notificación toasts
            productResults: [], // Almacena los resultados de la búsqueda de productos
            productCategories: [], // Almacena todas las categorías de productos disponibles
            productTags: [] // Almacena todas las etiquetas de productos disponibles
        };
    },

    //getters para acceder a los valores de las propiedades del estado para evitar el accesso directo. Para los toasts no son necesarios porque no se acceden a ellos. Solo se añaden y eliminan
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
    //setters para las propiedadedes del setter
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
        //Para añadir mensajes toasta al toast state, que puede soportar varios
        addToast(state, toast) {
            state.toasts.push(toast);
        },
        //para eliminar mensajes toast por su titulo
        clearToast(state, title) {
            const index = state.toasts.findIndex((toast) => toast.title === title); // se encuentra el toast por si indice
            if (index != null) {
                state.toasts.splice(index, 1); // se elimina si se ha encontrado
            }
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
    //Coleccion de las acciones que se ejecutan tanto sobre el estado como sobre elementos de la API sin estar asociados a propiedades del state pero que se usan en diversas partes de la app
    actions: {
        // Acción para iniciar sesión
        async login({ commit }, { payload }) {
            try {
                // Obtener cookie CSRF
                await axios.get(`${baseUrl}/sanctum/csrf-cookie`);

                // Solicitud de inicio de sesión
                const response = await axios.post(baseApiUrl + "/login", payload);

                // Obtener datos de usuario, si el inicio de sesión es exitoso
                const userData = await axios.get(baseApiUrl + "/user");

                // Commit mutations
                commit('SET_AUTHENTICATED', true);
                commit('SET_USER', userData.data.data); // la respuesta es un objeto de usuario envuelto en data

                // Comprobar si el usuario es administrador
                if (userData.data.data.user_is_admin) {
                    commit('SET_USER_IS_ADMIN', true);
                }
            } catch (error) {
                console.error("Error:", error.response);
                // Manejar error
                commit('SET_USER', {});
                commit('SET_AUTHENTICATED', false);
                commit('SET_USER_IS_ADMIN', false);
                // Volver a lanzar el error para que el llamador también pueda manejarlo, si es necesario
                throw error;
            }
        },

        // Acción para cerrar sesión
        async logout({ commit }) {
            try {
                await axios.post(baseApiUrl + "/logout"); // Realiza una solicitud para cerrar sesión llamando al endpoint de la API y actualiza el estado de autenticación
                commit('SET_USER', {}); // Limpia los datos del usuario en el estado
                commit('SET_AUTHENTICATED', false); // Establece el estado de autenticación como falso
                commit('SET_USER_IS_ADMIN', false); // Establece el estado de usuario administrador como falso
            } catch (error) {
                // Volver a lanzar el error para que el llamante también pueda manejarlo, si es necesario
                throw error;
            }
        },

        // Acción para obtener los datos de un producto
        async getProductData({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}?include_tags=true`; // URL de destino para obtener los datos de un producto, incluyendo las etiquetas asociadas
                const response = await axios.get(targetURL); // Realiza la solicitud para obtener los datos del producto
                return response.data.data; // Devuelve los datos del producto
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para eliminar un producto
        async deleteProduct({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}`; // URL de destino para eliminar un producto
                const response = await axios.delete(targetURL); // Realiza la solicitud para eliminar el producto
                return response.data.data; // Devuelve los datos del producto eliminado
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para eliminar una etiqueta
        async deleteTag({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/tags/${id}`; // URL de destino para eliminar una etiqueta
                const response = await axios.delete(targetURL); // Realiza la solicitud para eliminar la etiqueta
                return response.data.data; // Devuelve los datos de la etiqueta eliminada
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para eliminar una categoría
        async deleteCategory({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/categories/${id}`; // URL de destino para eliminar una categoría
                const response = await axios.delete(targetURL); // Realiza la solicitud para eliminar la categoría
                return response.data.data; // Devuelve los datos de la categoría eliminada
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para actualizar los datos de un producto
        async updateProductData({ commit }, { id, payload }) {
            try {
                const targetURL = `${baseApiUrl}/products/${id}`; // URL de destino para actualizar los datos de un producto
                const response = await axios.put(targetURL, payload); // Realiza la solicitud para actualizar los datos del producto
                return response.data.data; // Devuelve los datos actualizados del producto
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para actualizar una etiqueta
        async updateTag({ commit }, { id, newname }) {
            try {
                const targetURL = `${baseApiUrl}/tags/${id}`; // URL de destino para actualizar una etiqueta
                const response = await axios.put(targetURL, { "name": newname }); // Realiza la solicitud para actualizar la etiqueta
                return response.data.data; // Devuelve los datos actualizados de la etiqueta
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para actualizar una categoría
        async updateCategory({ commit }, { id, newname }) {
            try {
                // URL de destino para actualizar la categoría
                const targetURL = `${baseApiUrl}/categories/${id}`;
                // Envía la solicitud para actualizar la categoría con el nuevo nombre
                const response = await axios.put(targetURL, { "name": newname });
                // Devuelve los datos de la categoría actualizada
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },

        // Acción para crear una etiqueta
        async createTag({ commit }, { name }) {
            try {
                // URL de destino para crear una nueva etiqueta
                const targetURL = `${baseApiUrl}/tags`;
                // Envía la solicitud para crear una nueva etiqueta con el nombre especificado
                const response = await axios.post(targetURL, { "name": name });
                // Devuelve los datos de la etiqueta recién creada
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },

        // Acción para crear una categoría
        async createCategory({ commit }, { name }) {
            try {
                // URL de destino para crear una nueva categoría
                const targetURL = `${baseApiUrl}/categories`;
                // Envía la solicitud para crear una nueva categoría con el nombre especificado
                const response = await axios.post(targetURL, { "name": name });
                // Devuelve los datos de la categoría recién creada
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },

        // Acción para obtener las solicitudes de un producto
        async getProductRequests({ commit }, id) {
            try {
                // URL de destino para obtener las solicitudes de un producto, incluyendo etiquetas y solicitudes
                const targetURL = `${baseApiUrl}/products/${id}?include_tags=true&include_requests=true`;
                // Realiza la solicitud para obtener los datos del producto y sus solicitudes asociadas
                const response = await axios.get(targetURL);
                // Devuelve los datos de las solicitudes del producto
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },

        // Acción para aceptar una solicitud de producto
        async acceptProductRequest({ commit }, { payload }) {
            try {
                // URL de destino para aceptar una solicitud de producto
                const targetURL = `${baseApiUrl}/requests/actions/accept`;
                // Envía la solicitud para aceptar la solicitud de producto especificada
                const response = await axios.post(targetURL, payload);
                // Devuelve los datos de la solicitud de producto aceptada
                return response.data.data;
            } catch (error) {
                throw error;
            }
        },

        // Acción para obtener los productos de un usuario
        async getUserProducts({ commit }, { userId, page }) {
            try {
                // URL de destino para obtener los productos de un usuario
                let targetURL = `${baseApiUrl}/users/${userId}/products`;

                // Si se proporciona un número de página, se agrega a la URL
                if (page !== undefined && typeof page === 'number') {
                    targetURL += `?page=${page}`;
                }

                // Realiza la solicitud para obtener los productos del usuario
                const response = await axios.get(targetURL);

                // Devuelve los datos de los productos obtenidos
                return response.data;
            } catch (error) {
                // Registra cualquier error que ocurra al recuperar los productos del usuario
                console.error('Error fetching user products:', error);
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para obtener todos los productos solicitados por un usuario
        async getAllUserRequestedProducts({ commit }, userId) {
            const userRequests = []; // Array para almacenar las solicitudes de usuario
            let currentPage = 1; // Página actual inicializada en 1

            while (true) {
                try {
                    // URL de destino para obtener las solicitudes de usuario de la página actual
                    let targetURL = `${baseApiUrl}/users/${userId}/requests?page=${currentPage}`;

                    // Realiza la solicitud para obtener las solicitudes de usuario de la página actual
                    const data = await axios.get(targetURL);

                    // Obtiene los objetos de solicitud de la respuesta y los agrega al array de solicitudes de usuario
                    const requestObjects = data.data.data;
                    userRequests.push(...requestObjects);

                    // Si no hay una página siguiente, se sale del bucle
                    if (!data.next_page_url) {
                        break;
                    }

                    // Incrementa la página actual para obtener las siguientes solicitudes
                    currentPage++;
                } catch (error) {
                    // Registra cualquier error que ocurra al recuperar las solicitudes de usuario
                    console.error('Error fetching user requests:', error);
                    throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
                }
            }

            // Después de completar el bucle, devuelve el array de solicitudes de usuario
            return userRequests;
        },

        // Acción para obtener todos los productos
        async getProducts({ commit }, page) {
            try {
                // URL de destino para obtener todos los productos
                let targetURL = `${baseApiUrl}/products`;

                // Si se proporciona un número de página, se agrega a la URL
                if (page !== undefined && typeof page === 'number') {
                    targetURL += `?page=${page}`;
                }

                // Realiza la solicitud para obtener todos los productos
                const response = await axios.get(targetURL);

                // Actualiza el estado de la aplicación con los resultados de los productos
                commit('setProductResults', response.data);

                // No se devuelve nada explícitamente ya que el estado ya ha sido actualizado
            } catch (error) {
                // Registra cualquier error que ocurra al recuperar los productos
                console.error('Error fetching products:', error);
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para obtener todas las categorías de productos
        async getProductCategories({ commit }) {
            try {
                let allCategories = []; // Array para almacenar todas las categorías de productos de todas las páginas

                let nextPage = `${baseApiUrl}/categories`; // Comenzar con la primera página de categorías

                while (nextPage) {
                    // Obtener datos de la próxima página de categorías
                    const response = await axios.get(nextPage);
                    // Agregar las categorías de la página actual al array
                    allCategories = allCategories.concat(response.data.data);

                    // Verificar si hay una página siguiente
                    nextPage = response.data.links.next;
                }
                // Actualizar el estado de la aplicación con todas las categorías de productos
                commit('setProductCategories', allCategories);
            } catch (error) {
                // Registra cualquier error que ocurra al recuperar las categorías de productos
                console.error('Error fetching product categories:', error);
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para obtener todas las etiquetas de productos
        async getProductTags({ commit }) {
            try {
                let allTags = []; // Array para almacenar todas las etiquetas de productos de todas las páginas

                let nextPage = `${baseApiUrl}/tags`; // Comenzar con la primera página de etiquetas

                while (nextPage) {
                    // Obtener datos de la próxima página de etiquetas
                    const response = await axios.get(nextPage);
                    // Agregar las etiquetas de la página actual al array
                    allTags = allTags.concat(response.data.data);

                    // Verificar si hay una página siguiente
                    nextPage = response.data.links.next;
                }
                // Actualizar el estado de la aplicación con todas las etiquetas de productos
                commit('setProductTags', allTags);
            } catch (error) {
                // Registra cualquier error que ocurra al recuperar las etiquetas de productos
                console.error('Error fetching product tags:', error);
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para buscar productos por término de búsqueda
        async searchProducts({ commit }, q) {
            try {
                // URL de destino para buscar productos con el término de búsqueda proporcionado
                const targetURL = `${baseApiUrl}/products/search?search=${q}`;
                // Realiza la solicitud para buscar productos
                const response = await axios.get(targetURL);
                // Actualiza el estado de la aplicación con los resultados de la búsqueda de productos
                commit('setProductResults', response.data);
                // No se devuelve nada explícitamente ya que el estado ya ha sido actualizado
            } catch (error) {
                // Registra cualquier error que ocurra durante la búsqueda de productos
                console.error('Error searching products:', error);
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para solicitar un restablecimiento de contraseña
        async forgotPassword({ commit }, { email }) {
            try {
                const csrf = await axios.get(`${baseUrl}/sanctum/csrf-cookie`); // Obtiene la cookie CSRF, ya que los usuarios no registrados o no conectados pueden no tenerla

                const targetURL = `${baseApiUrl}/forgot-password`; // URL de destino para solicitar un restablecimiento de contraseña
                const response = await axios.post(targetURL, { "email": email }); // Realiza la solicitud de restablecimiento de contraseña
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para restablecer la contraseña
        async resetPassword({ commit }, { payload }) {
            // El payload debe consistir en token, email, password y password_confirmation
            try {
                const csrf = await axios.get(`${baseUrl}/sanctum/csrf-cookie`); // Obtiene la cookie CSRF, ya que los usuarios no registrados o no conectados pueden no tenerla
                const targetURL = `${baseApiUrl}/reset-password`; // URL de destino para restablecer la contraseña
                const response = await axios.post(targetURL, payload); // Realiza la solicitud de restablecimiento de contraseña
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para obtener el usuario autenticado
        async getAuthUser({ commit }) {
            try {
                const response = await axios.get(`${baseApiUrl}/user`); // Obtiene los datos del usuario autenticado

                // Verifica los códigos de estado 401 (No autorizado) o 419 (Tiempo de autenticación agotado)
                if (response.status === 401 || response.status === 419) {
                    // Si el usuario no está autorizado, establece el usuario como no autenticado y no admin
                    commit('SET_USER', {});
                    commit('SET_AUTHENTICATED', false);
                    commit('SET_USER_IS_ADMIN', false);
                    console.log("No valid session");
                }

                // Registra los detalles del usuario autenticado
                console.log("calling getAuthUser");
                console.log(response.data.data);

                // Actualiza el estado de la aplicación con los datos del usuario autenticado
                commit('SET_USER', response.data.data);
                commit('SET_AUTHENTICATED', true);

                // Verifica si el usuario es administrador
                if (response.data.data.user_is_admin) {
                    commit('SET_USER_IS_ADMIN', true);
                }
            } catch (error) {
                // Si se produce un error, maneja el error estableciendo al usuario como no autenticado y no admin
                commit('SET_USER', {});
                commit('SET_AUTHENTICATED', false);
                commit('SET_USER_IS_ADMIN', false);

                // Lanza el error para que el llamante pueda manejarlo si es necesario
                //throw error;
            }
        },

        // Acción para actualizar los detalles del usuario
        async updateUserDetails({ commit }, { id, payload }) {
            try {
                const targetURL = `${baseApiUrl}/users/${id}`; // URL de destino para actualizar los detalles del usuario
                const response = await axios.put(targetURL, payload); // Realiza la solicitud para actualizar los detalles del usuario
                return response.data.data; // Devuelve los datos actualizados del usuario
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        },

        // Acción para obtener los detalles de contacto del usuario
        async getUserContactDetails({ commit }, id) {
            try {
                const targetURL = `${baseApiUrl}/users/${id}`; // URL de destino para obtener los detalles de contacto del usuario
                const response = await axios.get(targetURL); // Realiza la solicitud para obtener los detalles de contacto del usuario
                const details = {
                    "email": response.data.data.email,
                    "phone": response.data.data.phone
                }; // Extrae los detalles de contacto del usuario de la respuesta
                return details; // Devuelve los detalles de contacto del usuario
            } catch (error) {
                throw error; // Lanza el error para que el llamante pueda manejarlo si es necesario
            }
        }

    }
});


export default store;