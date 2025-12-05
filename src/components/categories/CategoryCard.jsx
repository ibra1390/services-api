import React from "react";
import indexacionImg from "../../image/categorias/serv_indexacion.jpg";
import temploImg from "../../image/categorias/serv_templo.jpg";
import obreroImg from "../../image/categorias/serv_obrero.jpg";
import visitaImg from "../../image/categorias/serv_visitafunval.jpg";
import otrosImg from "../../image/categorias/serv_otros.jpg";

// Mapeo de imágenes por nombre de categoría
const categoryImages = {
  // Indexación
  "Templo e Historia familiar, Indexacion": indexacionImg,

  // Instructor
  Instructor: otrosImg,
  "Instructor.": otrosImg,

  // Liderazgo
  Liderazgo: obreroImg,

  // Revisión
  Revision: indexacionImg,

  // Asistencia al templo
  "Asistencia al templo": visitaImg,

  // Templo
  Templo: temploImg,

  // Otros
  "Obrero de construcción": obreroImg,
  "Referir estudiantes": otrosImg,
  "Visita en Funval": visitaImg,
  Otros: otrosImg,
};

// Función para obtener la imagen correcta
const getCategoryImage = (categoryName) => {
  // Buscar coincidencia exacta
  if (categoryImages[categoryName]) {
    return categoryImages[categoryName];
  }

  // Buscar coincidencia parcial
  for (const [key, value] of Object.entries(categoryImages)) {
    if (
      categoryName?.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(categoryName?.toLowerCase())
    ) {
      return value;
    }
  }

  // Imagen por defecto
  return categoryImages["Otros"];
};

export default function CategoryCard({ category }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagen */}
      <div className="h-48 overflow-hidden">
        <img
          src={getCategoryImage(category.name)}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {category.description || "Sin descripción"}
        </p>
      </div>
    </div>
  );
}
