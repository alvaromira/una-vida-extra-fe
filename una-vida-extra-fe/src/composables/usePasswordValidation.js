export const usePasswordValidation = () => {
    const validatePassword = (password) => {
        // Validate that password is provided and is a string
        if (typeof password !== 'string') {
            throw new Error('Password must be a string');
        }
        // Check if the password is at least 8 characters long
        if (password.length < 8) {
            return false;
        }

        // Check if the password contains at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return false;
        }

        // Check if the password contains at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return false;
        }

        // Check if the password contains at least one number
        if (!/\d/.test(password)) {
            return false;
        }

        // Check if the password contains at least one special character
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return false;
        }

        // If all conditions are met, return true
        return true;
    };

    return { validatePassword };
};
