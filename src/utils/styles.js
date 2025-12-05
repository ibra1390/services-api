// Clases CSS reutilizables
export const buttonStyles = {
  primary:
    "px-4 py-2 bg-[#274fff] text-white rounded-lg hover:bg-[#1e3bb8] transition-colors",
  secondary:
    "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
  danger:
    "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",
  disabled: "opacity-50 cursor-not-allowed",
};

export const cardStyles = {
  base: "bg-white rounded-lg shadow",
  hover: "bg-white rounded-lg shadow hover:shadow-lg transition-shadow",
};

export const inputStyles = {
  base: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274fff] focus:border-transparent",
  error:
    "w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500",
};

export const textStyles = {
  heading: "text-3xl font-bold text-gray-900",
  subheading: "text-xl font-semibold text-gray-800",
  label: "block text-sm font-medium text-gray-700 mb-1",
  error: "text-sm text-red-600 mt-1",
};
