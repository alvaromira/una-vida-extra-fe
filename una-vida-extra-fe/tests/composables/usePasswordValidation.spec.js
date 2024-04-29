import { usePasswordValidation } from '@/composables/usePasswordValidation';
import { expect, describe, it } from 'vitest';

describe('usePasswordValidation', () => {
    it('throws error for non-string password', () => {
        const { validatePassword } = usePasswordValidation();
        expect(() => validatePassword(123)).toThrowError('Password must be a string');
    });

    it('returns false for password less than 8 characters', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('weakpass')).toBe(false);
    });

    it('returns false for password without uppercase letter', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('password123')).toBe(false);
    });

    it('returns false for password without lowercase letter', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('PASSWORD123')).toBe(false);
    });

    it('returns false for password without number', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('passwordstrong')).toBe(false);
    });

    it('returns false for password without special character', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('password123A')).toBe(false);
    });

    it('returns true for valid password', () => {
        const { validatePassword } = usePasswordValidation();
        expect(validatePassword('StrongPassword123!')).toBe(true);
    });
});
