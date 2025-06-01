"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"

export default function ReenviarConfirmacionPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simular reenvío de email de confirmación
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Verificar si el email existe en nuestros usuarios mock
      const mockUsers = ["admin@novaforge.com", "usuario@novaforge.com", "maria@email.com", "carlos@email.com"]

      if (mockUsers.includes(email.toLowerCase())) {
        setIsSuccess(true)
      } else {
        setError("No encontramos una cuenta asociada a este email")
      }
    } catch (error) {
      console.error("Error en reenvío:", error)
      setError("Error al enviar el email. Inténtalo de nuevo más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900/20 to-blue-900/20">
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-500/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 min-h-screen pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="bg-green-900/30 backdrop-blur-xl border border-green-500/50 rounded-2xl p-8 shadow-2xl">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 backdrop-blur-sm mb-6">
                <svg
                  className="h-8 w-8 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-300 mb-4">¡Email reenviado!</h3>
              <p className="text-green-200 mb-6">
                Hemos enviado un nuevo email de confirmación a <strong>{email}</strong>
              </p>
              <div className="bg-green-800/30 rounded-lg p-4 mb-6 text-left">
                <h4 className="text-green-300 font-semibold mb-2">Próximos pasos:</h4>
                <ul className="text-green-200 text-sm space-y-1">
                  <li>• Revisa tu bandeja de entrada</li>
                  <li>• Busca también en spam/correo no deseado</li>
                  <li>• Haz click en el enlace del email</li>
                  <li>• Tu cuenta será activada automáticamente</li>
                </ul>
              </div>
              <div className="flex flex-col space-y-3">
                <button onClick={() => navigate("/login")} className="btn-primary">
                  Ir al login
                </button>
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                  }}
                  className="btn-outline"
                >
                  Enviar a otro email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo animado con partículas */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20">
        <div className="absolute inset-0">
          {/* Partículas flotantes */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Gradientes decorativos */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header con logo animado */}
          <div
            className={`text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
          >
            <Link to="/" className="inline-flex items-center justify-center mb-6 group">
              <div className="relative h-14 w-14 mr-3">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-800 rounded-full animate-spin-slow group-hover:animate-pulse"></div>
                <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                    N
                  </span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold text-white block">
                  NovaForge<span className="text-purple-500">Games</span>
                </span>
                <span className="text-xs text-gray-400">Tu universo gaming</span>
              </div>
            </Link>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Reenviar confirmación</h2>
              <p className="text-gray-400">Te enviaremos un nuevo email de confirmación</p>
            </div>
          </div>

          {/* Formulario con glassmorphism */}
          <div
            className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-xl p-3 text-sm backdrop-blur-sm animate-shake">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* Información */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-blue-200 text-sm">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium mb-1">¿No recibiste el email de confirmación?</p>
                      <p className="text-xs text-blue-300">
                        Introduce tu email y te enviaremos un nuevo enlace de confirmación
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campo de email */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="label text-gray-300 group-focus-within:text-purple-400 transition-colors"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="input-modern pl-12"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Botón de envío */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-modern w-full disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando email...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Reenviar confirmación
                        <svg
                          className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {/* Links de navegación */}
              <div className="mt-6 text-center space-y-3">
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline flex items-center justify-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Volver al login
                </Link>
                <p className="text-gray-400 text-sm">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/registro"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
