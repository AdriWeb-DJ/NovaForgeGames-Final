"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/auth-context"
import { useNavigate } from "react-router"
import axios from "axios"

interface Compra {
  id_compra: number
  fecha_compra: string
  total: number
}

export default function PerfilPage() {
  const { user, logout, setUser } = useAuth() as any
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [compras, setCompras] = useState<Compra[]>([])
  const [comprasLoading, setComprasLoading] = useState(true)
  const comprasRef = useRef<HTMLDivElement>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    setFormData({
      nombre: user.nombre || "",
      email: user.email || "",
      telefono: user.telefono?.replace("+34 ", "") || "",
    })

    // Cargar historial de compras real
    const fetchCompras = async () => {
      setComprasLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/compras/usuario/${user.id_usuario}`)
        setCompras(res.data)
      } catch (e) {
        setCompras([])
      }
      setComprasLoading(false)
    }
    fetchCompras()
  }, [user, navigate])

  const formatSpanishPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "")
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`
    } else {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 9)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatSpanishPhoneNumber(e.target.value)
    setFormData((prev) => ({
      ...prev,
      telefono: formattedPhone,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    try {
      // Actualizar usuario en el backend
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/usuarios/${user.id_usuario}`,
        {
          nombre: formData.nombre,
          email: formData.email,
          contraseña: "", // o null si tu backend lo permite
          id_rol: user.id_rol,
          telefono: "+34 " + formData.telefono,
          is_active: user.is_active,
        }
      )
      if (setUser) {
        setUser(res.data) // <-- Usa la respuesta del backend
        localStorage.setItem("user", JSON.stringify(res.data)) // <-- Actualiza también el localStorage
      }
      setMessage({ type: "success", text: "Perfil actualizado exitosamente" })
      setIsEditing(false)
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el perfil" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    // El navigate ya está en el contexto, así que no hace falta aquí
  }

  // Cambiar contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (password1 !== password2) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" })
      return
    }
    setPasswordLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usuarios/cambiar-contraseña`, {
        usuario_id: user.id_usuario,
        nueva_contraseña: password1,
      })
      setShowPasswordModal(false)
      setPassword1("")
      setPassword2("")
      setMessage({ type: "success", text: "Contraseña cambiada correctamente" })
    } catch (error: any) {
      setMessage({ type: "error", text: error?.response?.data?.detail || "Error al cambiar la contraseña" })
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        <p className="text-gray-400 mt-2">Gestiona tu información personal y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información del perfil */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Información Personal</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-outline py-2 px-4 text-sm">
                  Editar
                </button>
              )}
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-900/30 border border-green-500 text-green-300"
                    : "bg-red-900/30 border border-red-500 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="label">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    className="input"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="label">
                    Número de teléfono
                  </label>
                  <div className="relative">
                    {isEditing ? (
                      <>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm">🇪🇸 +34</span>
                        </div>
                        <input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          className="input pl-16"
                          value={formData.telefono}
                          onChange={handlePhoneChange}
                          maxLength={11}
                          placeholder="612 345 678"
                        />
                      </>
                    ) : (
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        className="input"
                        value={user.telefono?.replace("+34 ", "") || ""}
                        disabled
                      />
                    )}
                  </div>
                  {isEditing && (
                    <p className="mt-1 text-xs text-gray-400">
                      Formato: 612 345 678 (móviles empiezan por 6 o 7, fijos por 8 o 9)
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        nombre: user.nombre || "",
                        email: user.email || "",
                        telefono: user.telefono?.replace("+34 ", "") || "",
                      })
                      setMessage(null)
                    }}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Historial de compras */}
          <div
            ref={comprasRef}
            className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 mt-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Historial de compras</h2>
            {comprasLoading ? (
              <div className="text-gray-400">Cargando compras...</div>
            ) : compras.length === 0 ? (
              <div className="text-gray-400">No tienes compras registradas.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Fecha</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map((compra) => (
                      <tr key={compra.id_compra} className="border-b border-slate-700">
                        <td className="px-4 py-2 text-white font-semibold">#{compra.id_compra}</td>
                        <td className="px-4 py-2 text-gray-300">
                          {new Date(compra.fecha_compra).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-2 text-primary font-bold">{compra.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Acciones de cuenta</h3>
            <div className="space-y-3">
              <button
                className="w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                onClick={() => setShowPasswordModal(true)}
              >
                Cambiar contraseña
              </button>
              <button
                className="w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                onClick={() => comprasRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Historial de compras
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
            <h3 className="text-lg font-bold text-white mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total gastado</span>
                <span className="text-white font-semibold">
                  {compras.reduce((acc, c) => acc + (c.total || 0), 0).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal cambiar contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full border border-purple-900/30">
            <h2 className="text-xl font-bold text-white mb-4">Cambiar contraseña</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                className="input w-full"
                placeholder="Nueva contraseña"
                value={password1}
                onChange={e => setPassword1(e.target.value)}
                required
              />
              <input
                type="password"
                className="input w-full"
                placeholder="Repetir contraseña"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                required
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPassword1("")
                    setPassword2("")
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={passwordLoading}>
                  {passwordLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
