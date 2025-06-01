"use client"

import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router"
import axios from "axios"

export default function ResetearContraseñaPage() {
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!password1 || !password2) {
      setMessage({ type: "error", text: "Rellena ambos campos" })
      return
    }
    if (password1 !== password2) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" })
      return
    }
    if (!token) {
      setMessage({ type: "error", text: "Token inválido o expirado" })
      return
    }
    setIsLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usuarios/resetear-contraseña`, {
        token,
        nueva_contraseña: password1,
      })
      setMessage({ type: "success", text: "¡Contraseña restablecida! Ya puedes iniciar sesión." })
      setTimeout(() => navigate("/login"), 2000)
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage({ type: "error", text: error.response.data.detail })
      } else {
        setMessage({ type: "error", text: "Error al restablecer la contraseña" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20 px-4">
      <div className="max-w-md w-full bg-slate-800/70 rounded-2xl shadow-2xl p-8 border border-purple-900/30">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Restablecer contraseña</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div
              className={`rounded-lg p-3 text-sm mb-2 ${
                message.type === "error"
                  ? "bg-red-900/30 border border-red-500/50 text-red-300"
                  : "bg-green-900/30 border border-green-500/50 text-green-300"
              }`}
            >
              {message.text}
            </div>
          )}
          <div>
            <label className="block text-gray-300 mb-1">Nueva contraseña</label>
            <input
              type="password"
              className="input w-full"
              value={password1}
              onChange={e => setPassword1(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Repetir contraseña</label>
            <input
              type="password"
              className="input w-full"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Restablecer contraseña"}
          </button>
        </form>
      </div>
    </div>
  )
}
