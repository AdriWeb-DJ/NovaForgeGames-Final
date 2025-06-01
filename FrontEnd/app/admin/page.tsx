"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "@/context/auth-context"

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    if (user.id_rol !== 1) {
      navigate("/")
      return
    }
  }, [user, navigate])

  if (!user || user.id_rol !== 1) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">Acceso denegado</h1>
          <p className="text-gray-400">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    )
  }

  const adminModules = [
    {
      title: "Gestión de Productos",
      description: "Crear, editar y eliminar productos del catálogo",
      icon: "🎮",
      href: "/admin/productos",
      color: "from-purple-600 to-blue-600",
      stats: "156 productos activos",
    },
    {
      title: "Gestión de Categorías",
      description: "Administrar categorías y subcategorías",
      icon: "📂",
      href: "/admin/categorias",
      color: "from-green-600 to-teal-600",
      stats: "8 categorías activas",
    },
    {
      title: "Gestión de Compras",
      description: "Ver y administrar pedidos de clientes",
      icon: "🛒",
      href: "/admin/compras",
      color: "from-orange-600 to-red-600",
      stats: "23 pedidos pendientes",
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Bienvenido, {user.nombre}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">👑 Administrador</span>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Ventas Hoy</p>
              <p className="text-2xl font-bold text-white">€1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Pedidos Nuevos</p>
              <p className="text-2xl font-bold text-white">23</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Usuarios Activos</p>
              <p className="text-2xl font-bold text-white">1,247</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <span className="text-2xl">🎮</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Productos</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos de administración */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Link
            key={index}
            to={module.href}
            className="group bg-slate-800 rounded-lg p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${module.color} rounded-lg text-white text-2xl`}>{module.icon}</div>
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              {module.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3">{module.description}</p>
            <div className="text-xs text-purple-400 font-medium">{module.stats}</div>
          </Link>
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-purple-900/30">
        <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          {[
            { action: "Nuevo pedido #1234", user: "María García", time: "Hace 5 min", type: "order" },
            { action: "Producto agregado: Cyberpunk 2077", user: "Admin", time: "Hace 15 min", type: "product" },
            { action: "Usuario registrado", user: "Carlos López", time: "Hace 30 min", type: "user" },
            { action: "Pedido completado #1230", user: "Ana Martín", time: "Hace 1 hora", type: "order" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    activity.type === "order"
                      ? "bg-green-600/20 text-green-400"
                      : activity.type === "product"
                        ? "bg-purple-600/20 text-purple-400"
                        : "bg-blue-600/20 text-blue-400"
                  }`}
                >
                  {activity.type === "order" ? "🛒" : activity.type === "product" ? "🎮" : "👤"}
                </div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.user}</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}