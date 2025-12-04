import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/dataService";
import Logo from "../image/LOGOFUNVALblan.png";
import ProfileModal from "./common/ProfileModal";

const MENU_ITEMS = [
  {
    name: "Usuarios",
    path: "/admin/users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Servicios",
    path: "/admin/services",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    name: "Escuelas",
    path: "/admin/schools",
    icon: "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  },
  { name: "Roles", path: "/admin/roles", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  {
    name: "Categorías",
    path: "/admin/categories",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Estudiantes",
    path: "/admin/students",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 7v-8.26l-7.53 4.88c-.49.33-.47.94.04 1.24C6.46 18.9 8.97 20 12 20s5.54-1.1 7.49-2.14c.51-.3.53-.91.04-1.24L12 13.74V21z",
  },
];

const Icon = ({ d }) => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    authService()
      .getProfile()
      .then(setProfile)
      .catch((err) => console.error("Error al cargar perfil:", err));
  }, []);

  const handleLogout = async () => {
    await authService().logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!profile) return "--";
    return `${profile.f_name?.[0] || ""}${profile.f_lastname?.[0] || ""}`;
  };

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-slate-800">
        <img src={Logo} alt="LogoFunval" />
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          ADMIN
        </div>
        <ul>
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon d={item.icon} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-800">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">{getInitials()}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {profile
                ? `${profile.f_name} ${profile.f_lastname}`
                : "Cargando..."}
            </div>
            <div className="text-xs text-slate-400">
              {profile?.role?.name || "Usuario"}
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Configuración"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 flex items-center justify-center gap-2 text-slate-300 hover:bg-slate-800 transition-colors border-t border-slate-800"
        >
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {profile && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={profile}
        />
      )}
    </aside>
  );
}
