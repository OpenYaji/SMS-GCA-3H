export const inputValidation = {
  allowOnlyNumbers: (value) => {
    return value.replace(/[^\d]/g, "");
  },

  // Allow numbers and plus sign for international phone numbers
  allowOnlyNumbersAndPlus: (value) => {
    // Keep only digits and the plus sign, but ensure only one plus at the beginning
    const cleaned = value.replace(/[^\d+]/g, "");
    // If there's a plus sign, ensure it's only at the beginning
    if (cleaned.includes("+")) {
      const parts = cleaned.split("+");
      // Keep only the first plus sign and join the rest
      return "+" + parts.slice(1).join("");
    }
    return cleaned;
  },

  // Only allow letters and basic name characters (for names)
  allowOnlyLetters: (value) => {
    return value.replace(/[^a-zA-Z\s\-'.ñÑáéíóúÁÉÍÓÚ]/g, "");
  },

  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number length (11-13 digits excluding + sign)
  validatePhoneNumberLength: (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    return numbers.length >= 11 && numbers.length <= 13;
  },

  // Format phone number for backend submission
  formatPhoneNumber: (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    return numbers;
  },

  handleNumericInput: (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^\d]/g, "");
    return numericValue;
  },

  handlePhoneInput: (e) => {
    const { value } = e.target;
    let phoneValue = value.replace(/[^\d+]/g, "");

    if (phoneValue.includes("+")) {
      const parts = phoneValue.split("+");
      phoneValue = "+" + parts.slice(1).join("");
    }

    return phoneValue;
  },

  // Prevent numeric input for names
  handleNameInput: (e) => {
    const { value } = e.target;
    const lettersOnly = value.replace(/[^a-zA-Z\s\-'.ñÑáéíóúÁÉÍÓÚ]/g, "");
    return lettersOnly;
  },

  validatePhoneNumber: (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    const hasValidLength = numbers.length >= 11 && numbers.length <= 13;
    const hasValidFormat = /^\+?\d+$/.test(value);

    return hasValidFormat && hasValidLength;
  },

  validatePhoneWithFeedback: (value) => {
    const numbers = value.replace(/[^\d]/g, "");
    const hasValidLength = numbers.length >= 11 && numbers.length <= 13;
    const hasValidFormat = /^\+?\d+$/.test(value);

    if (!value) {
      return { isValid: false, message: "Phone number is required" };
    }

    if (!hasValidFormat) {
      return { isValid: false, message: "Invalid phone number format" };
    }

    if (!hasValidLength) {
      return {
        isValid: false,
        message: `Phone number must be 11-13 digits (currently ${numbers.length})`,
      };
    }

    return { isValid: true, message: "" };
  },

  handleEnhancedPhoneInput: (e) => {
    const { value } = e.target;
    let phoneValue = value.replace(/[^\d+]/g, "");

    if (phoneValue.includes("+")) {
      const parts = phoneValue.split("+");
      phoneValue = "+" + parts.slice(1).join("");
    }

    // Limit to 13 characters (including + and spaces)
    if (phoneValue.length > 13) {
      phoneValue = phoneValue.slice(0, 13);
    }

    return phoneValue;
  },
};

export default inputValidation;
