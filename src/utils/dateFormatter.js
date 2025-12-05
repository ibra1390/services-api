export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: includeTime ? "long" : "2-digit",
    day: "2-digit",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleDateString("es-ES", options);
};
