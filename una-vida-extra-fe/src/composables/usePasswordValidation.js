/**Se trata de una funcion generica para validar password que se puede usar en varios sitios */
export const usePasswordValidation = () => {
    const validatePassword = (password) => {
        // Valida que se proporcione la contraseña y que sea una cadena
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }
        //Comprueba si la contraseña tiene al menos 8 caracteres
        if (password.length < 8) {
            return false;
        }

        //Comprueba si la contraseña contiene al menos una letra mayúscula
        if (!/[A-Z]/.test(password)) {
            return false;
        }

        //Comprueba si la contraseña contiene al menos una letra minúscula
        if (!/[a-z]/.test(password)) {
            return false;
        }

        //Comprueba si la contraseña contiene al menos un número
        if (!/\d/.test(password)) {
            return false;
        }

        //Comprueba si la contraseña contiene al menos un carácter especial
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return false;
        }

        // Si se cumplen todas las condiciones, devuelve verdadero
        return true;
    };

    return { validatePassword };
};
