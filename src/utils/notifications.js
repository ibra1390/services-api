// Sistema simple de notificaciones (puede mejorarse con toast libraries)
export const showSuccess = (message) => {
  alert(message);
};

export const showError = (error, defaultMessage = "Ocurrió un error") => {
  const message =
    error?.response?.data?.message || error?.message || defaultMessage;
  alert(message);
};

export const showWarning = (message) => {
  alert(message);
};

export const showConfirm = (message) => {
  return window.confirm(message);
};
