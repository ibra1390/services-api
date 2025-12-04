import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";

export default function SchoolModal({
  isOpen,
  onClose,
  onSubmit,
  school,
  isSubmitting,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(school?.name || "");
  }, [school]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim() });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={school ? "Editar Escuela" : "Crear Escuela"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Nombre *</label>
          <input
            type="text"
            value={name}
            disabled={isSubmitting}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            {isSubmitting ? "Guardando..." : school ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
