import React, { useState } from "react";
import Modal from "./Modal";
import UserInfoHeader from "./UserInfoHeader";
import UserInfoFields from "./UserInfoFields";
import PasswordChangeForm from "./PasswordChangeForm";

export default function ProfileModal({ isOpen, onClose, user }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mi Perfil"
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6">
        <UserInfoHeader user={user} />
        <UserInfoFields user={user} columns={3} />

        <div className="border-t pt-6">
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full px-4 py-2 bg-[#274fff] text-white rounded-lg hover:bg-[#1e3bb8] transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Cambiar Contraseña
            </button>
          ) : (
            <PasswordChangeForm
              onCancel={() => setIsChangingPassword(false)}
              onSuccess={() => setIsChangingPassword(false)}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
