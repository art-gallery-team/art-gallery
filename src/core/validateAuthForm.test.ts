import { describe, expect, it } from 'vitest';
import { validateAuthForm } from './validateAuthForm';

describe('validateAuthForm', () => {
  it('should return isValid: true for valid email and password', () => {
    const result = validateAuthForm('user@example.com', 'secret123');
    expect(result).toEqual({ isValid: true, errors: {} });
  });

  it('should trim whitespace around email before validation', () => {
    const result = validateAuthForm('  user@example.com  ', 'secret123');
    expect(result.isValid).toBe(true);
  });

  it('should return error when email is empty or invalid', () => {
    expect(validateAuthForm('', 'secret123')).toEqual({
      isValid: false,
      errors: { email: 'Email is required' },
    });

    expect(validateAuthForm('invalid-email', 'secret123')).toEqual({
      isValid: false,
      errors: { email: 'Please enter a valid email address' },
    });
  });

  it('should return error when password is empty or shorter than 6 characters', () => {
    expect(validateAuthForm('user@example.com', '')).toEqual({
      isValid: false,
      errors: { password: 'Password is required' },
    });

    expect(validateAuthForm('user@example.com', '12345')).toEqual({
      isValid: false,
      errors: { password: 'Password must be at least 6 characters' },
    });
  });

  it('should return both errors when both fields are invalid', () => {
    const result = validateAuthForm('bad', '123');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });
});
