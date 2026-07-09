export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasPunctuation: boolean;
}

export const validatePasswordRequirements = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasPunctuation: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

export const isPasswordValid = (requirements: PasswordRequirements): boolean => {
  return (
    requirements.minLength &&
    requirements.hasUppercase &&
    requirements.hasNumber &&
    requirements.hasPunctuation
  );
};
