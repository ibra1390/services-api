import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../image/LOGOFUNVALblan.png";

export default function SideNav() {
  const location = useLocation();

  const menuItems = [
    {
      section: "ADMIN",
      items: [
        {
          name: "Usuarios",
          path: "/admin/users",
          icon: (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ),
        },
        {
          name: "Servicios",
          path: "/admin/services",
          icon: (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
        },
        {
          name: "Escuelas",
          path: "/admin/schools",
          icon: (
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
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          ),
        },
        {
          name: "Roles",
          path: "/admin/roles",
          icon: (
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-4 flex items-center gap-3 border-b border-slate-800">
        <img src={Logo} alt="LogoFunval" />
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {section.section}
            </div>
            <ul>
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Admin Test</div>
            <div className="text-xs text-slate-400">Admin</div>
          </div>
        </div>
        <button className="w-full px-4 py-3 flex items-center justify-center gap-2 text-slate-300 hover:bg-slate-800 transition-colors border-t border-slate-800">
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
