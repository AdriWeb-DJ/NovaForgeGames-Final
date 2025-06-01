"use client"

import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router"
import axios from "axios"

export default function ConfirmarEmailPage() {
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState("")
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const confirmar = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Token no proporcionado.")
        return
      }
      try {
        console.log(token);
        console.log(encodeURIComponent(token));
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/usuarios/confirmar-email?token=${encodeURIComponent(token)}`
        )
        setStatus("success")
        setMessage(res.data.msg || "¡Tu cuenta ha sido confirmada correctamente!")
      } catch (err: any) {
        setStatus("error")
        const detail = err?.response?.data?.detail
        if (Array.isArray(detail)) {
          setMessage(detail.map((e: any) => e.msg).join(" | "))
        } else if (typeof detail === "string") {
          setMessage(detail)
        } else {
          setMessage("El enlace no es válido o ya ha sido usado. Si el problema persiste, contacta con soporte.")
        }
      }
    }
    confirmar()
    // eslint-disable-next-line
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content px-4">
      <div className="max-w-md w-full bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-900/30 text-center">
        {status === "pending" && (
          <>
            <div className="flex justify-center mb-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
            <h2 className="text-xl font-bold mb-2">Confirmando tu cuenta...</h2>
            <p className="text-gray-400">Por favor, espera unos segundos.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">¡Cuenta confirmada!</h2>
            <p className="mb-4 text-gray-300">{message}</p>
            <Link to="/login" className="btn btn-primary w-full">
              Iniciar sesión
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Error al confirmar</h2>
            <p className="mb-4 text-gray-300">{message}</p>
            <Link to="/registro" className="btn btn-outline btn-primary w-full">
              Volver al registro
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
