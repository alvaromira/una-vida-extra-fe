import { usePasswordValidation } from '@/composables/usePasswordValidation';
import { expect, describe, it } from 'vitest';

//Es siguiente metodo es una bateria de pruebas unitarias para la función usePasswordValidation. La descripción de cada una es realmente lo que sigue al statement it
describe('usePasswordValidation', () => {
    it('lanza un error para contraseñas que no son cadenas', () => {
        const { validatePassword } = usePasswordValidation();
        expect(() => validatePassword(123)).toThrowError('Password must be a string');
    });

    it('devuelve falso para contraseñas con menos de 8 caracteres', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('weakpass')).toBe(false);
    });

    it('devuelve falso para contraseñas sin letras mayúsculas', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('password123')).toBe(false);
    });

    it('devuelve falso para contraseñas sin letras minúsculas', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('PASSWORD123')).toBe(false);
    });

    it('devuelve falso para contraseñas sin número', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('passwordstrong')).toBe(false);
    });

    it('devuelve falso para contraseñas sin carácter especial', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('password123A')).toBe(false);
    });

    it('devuelve verdadero para contraseñas válidas', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('StrongPassword123!')).toBe(true);
    });
});
