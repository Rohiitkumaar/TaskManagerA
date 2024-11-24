// src/utils/validate.js

export const checkValidData = (email, password) => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "Invalid email format.";

  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasDigit = /\d/;
  const hasSpecialChar = /[!@#$%^&*.,?]/;

  if (!hasUppercase.test(password))
    return "Password must include at least one uppercase letter.";
  if (!hasLowercase.test(password))
    return "Password must include at least one lowercase letter.";
  if (!hasDigit.test(password))
    return "Password must include at least one digit.";
  if (!hasSpecialChar.test(password))
    return "Password must include at least one special character.";

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*.,?]{8,}$/;
  if (!passwordRegex.test(password))
    return "Password must be at least 8 characters long and meet all requirements.";

  return null; 
};

export const validateName = (name) => {
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters long.";
  }
  return null; 
};
