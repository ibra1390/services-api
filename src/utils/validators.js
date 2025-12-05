// Validaciones comunes para formularios
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} es requerido`;
  }
  return null;
};

export const validatePositiveNumber = (value, fieldName) => {
  if (!value || value <= 0) {
    return `${fieldName} debe ser un número positivo`;
  }
  return null;
};

export const validateFileType = (file, allowedTypes, fieldName = "Archivo") => {
  if (!file) return null;

  if (!allowedTypes.includes(file.type)) {
    const types = allowedTypes
      .map((t) => t.split("/")[1].toUpperCase())
      .join(", ");
    return `Solo se permiten archivos: ${types}`;
  }
  return null;
};

// Validar múltiples campos
export const validateForm = (fields) => {
  const errors = {};

  Object.entries(fields).forEach(([key, config]) => {
    const { value, validators } = config;

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
