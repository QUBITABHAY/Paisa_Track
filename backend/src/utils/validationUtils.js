export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  
  return { isValid: true };
};

export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};
