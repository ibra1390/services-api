import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import UserInfoHeader from "../common/UserInfoHeader";
import UserInfoFields from "../common/UserInfoFields";
import { dataService } from "../../services/dataService";

export default function UserDetailModal({ isOpen, onClose, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataService().getById(userId);
        setUser(data);
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener detalles del usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Usuario"
      maxWidth="max-w-3xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Cargando...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      ) : user ? (
        <div className="space-y-6">
          <UserInfoHeader user={user} />
          <UserInfoFields user={user} columns={2} />

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
