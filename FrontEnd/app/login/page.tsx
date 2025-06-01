"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/context/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Formato de email inválido").max(100),
  password: z.string().min(1, "La contraseña es requerida").min(6, "Mínimo 6 caracteres").max(50),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { login, isLoading, error: authError } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  useEffect(() => { setIsLoaded(true) }, [])

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      navigate("/")
    } catch (error) {
      // Manejo de error ya gestionado por el contexto
    }
  }

  const fillTestUser = (userType: "admin" | "user") => {
    if (userType === "admin") {
      setValue("email", "admin@novaforge.com", { shouldValidate: true, shouldTouch: true })
      setValue("password", "admin123", { shouldValidate: true, shouldTouch: true })
    } else {
      setValue("email", "usuario@novaforge.com", { shouldValidate: true, shouldTouch: true })
      setValue("password", "usuario123", { shouldValidate: true, shouldTouch: true })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20 pointer-events-none">
        <div className="absolute inset-0">
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-800/5 rounded-full blur-2xl" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo y bienvenida */}
          <div className={`text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
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
              <h2 className="text-3xl font-bold text-white">¡Bienvenido de vuelta!</h2>
              <p className="text-gray-400">Inicia sesión para acceder a tu cuenta</p>
            </div>
          </div>

          {/* Usuarios de prueba */}
          <div className={`transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="mb-6 p-4 bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl">
              <h3 className="text-sm font-medium text-blue-300 mb-3">👤 Usuarios de prueba:</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillTestUser("admin")}
                  className="w-full text-left p-2 bg-blue-800/30 hover:bg-blue-700/40 rounded-lg text-sm text-blue-200 transition-all duration-200 hover:scale-105"
                >
                  🔧 <strong>Admin:</strong> admin@novaforge.com / admin123
                </button>
                <button
                  type="button"
                  onClick={() => fillTestUser("user")}
                  className="w-full text-left p-2 bg-green-800/30 hover:bg-green-700/40 rounded-lg text-sm text-green-200 transition-all duration-200 hover:scale-105"
                >
                  👤 <strong>Usuario:</strong> usuario@novaforge.com / usuario123
                </button>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className={`transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {authError && (
                  <div className="alert alert-error shadow-sm mb-2 animate-shake">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {authError}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="label mb-2 text-gray-300">Correo electrónico *</label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className={`input input-bordered w-full ${errors.email ? "input-error" : "input-primary"}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="label mb-2 text-gray-300">Contraseña *</label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`input input-bordered w-full pr-12 ${errors.password ? "input-error" : "input-primary"}`}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Opciones adicionales */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...register("rememberMe")}
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                    <span className="text-sm text-gray-300">Recordarme</span>
                  </label>
                  <Link to="/recuperar-password" className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="text-center">
                  <Link to="/reenviar-confirmacion" className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                    ¿No recibiste el email de confirmación?
                  </Link>
                </div>

                {/* Botón de login */}
                <button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Iniciar Sesión
                      <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="divider text-gray-400">O continúa con</div>

              {/* Botones sociales */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="btn btn-outline w-full flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button type="button" className="btn btn-outline w-full flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Link de registro */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/registro" className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors">
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
