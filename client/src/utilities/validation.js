export const validateCombination = (isConvertible, roofName) => {
  if (isConvertible && roofName === "Sunroof") {
    return {
      valid: false,
      message: "❌ Convertible cannot have a Sunroof!",
    };
  }
  return { valid: true, message: "" };
};
