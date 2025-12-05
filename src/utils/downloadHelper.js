import { serviceService } from "../services/serviceService";

export const downloadEvidence = async (serviceId) => {
  if (!serviceId) return;

  try {
    const response = await serviceService().loadEvidence(serviceId);

    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evidencia_${serviceId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error al descargar evidencia:", error);
    throw error;
  }
};
