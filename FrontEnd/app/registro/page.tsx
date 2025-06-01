"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"

// Schema de validación con Zod
const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre es demasiado largo")
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Formato de email inválido")
      .max(100, "El email es demasiado largo"),
    telefono: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^[6-9]\d{2}\s?\d{3}\s?\d{3}$/, "Formato de teléfono español inválido (ej: 612 345 678)"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(50, "La contraseña es demasiado larga")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegistroFormData = z.infer<typeof registroSchema>

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const watchedFields = watch()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
    setValue("telefono", formattedPhone, { shouldValidate: true, shouldTouch: true })
  }

  const onSubmit = async (data: RegistroFormData) => {
    setIsLoading(true)
    try {
      // Puedes hashear la contraseña aquí si lo necesitas antes de enviarla
      // const hashedPassword = await hashPassword(data.password)

      await axios.post("http://localhost:8000/usuarios/pre-registro", {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        contraseña: data.password, // O hashedPassword si la hasheas aquí
        id_rol: 2, // Cambia según tu lógica de roles
        is_active: true, // O según tu lógica
      })

      // Simular el envío del email de confirmación
      setEmailConfirmationSent(true)
    } catch (error: any) {
      // Manejo de errores del backend
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.detail || "Error en el registro")
      } else {
        alert("Error de red o inesperado")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función para obtener el estado visual del campo
  const getFieldState = (fieldName: keyof RegistroFormData) => {
    const hasError = !!errors[fieldName]
    const isTouched = !!touchedFields[fieldName]
    const hasValue = !!watchedFields[fieldName]

    if (hasError && isTouched) return "error"
    if (!hasError && isTouched && hasValue) return "success"
    return "default"
  }

  const getFieldClasses = (fieldName: keyof RegistroFormData) => {
    const state = getFieldState(fieldName)
    const baseClasses = "input-modern pl-12"

    switch (state) {
      case "error":
        return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500/20`
      case "success":
        return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500/20`
      default:
        return `${baseClasses} pr-12`
    }
  }

  const getIconClasses = (fieldName: keyof RegistroFormData) => {
    const state = getFieldState(fieldName)
    const baseClasses = "h-5 w-5 transition-colors"

    switch (state) {
      case "error":
        return `${baseClasses} text-red-400`
      case "success":
        return `${baseClasses} text-green-400`
      default:
        return `${baseClasses} text-gray-400 group-focus-within:text-purple-400`
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

    const labels = ["Muy débil", "Débil", "Regular", "Buena", "Muy fuerte"]
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-500",
    }
  }

  const passwordStrength = getPasswordStrength(watchedFields.password || "")

  if (emailConfirmationSent) {
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0l-7.89 5.26a2 2 0 01-2.22 0L3 8m0 0l4-1.333A2 2 0 017 5.333z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-300 mb-4">¡Confirma tu email!</h3>
              <p className="text-green-200 mb-6">
                Te hemos enviado un email a <strong>{watchedFields.email}</strong>. Por favor, sigue las instrucciones
                para verificar tu cuenta.
              </p>
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    // Simular reenvío de confirmación
                    console.log("Simulando reenvío de email de confirmación a:", watchedFields.email)
                    alert("Email de confirmación reenviado (simulado).")
                  }}
                  className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Reenviar confirmación
                </button>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Ir al Login
                </Link>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-800/5 rounded-full blur-2xl" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen pt-20 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
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
              <h2 className="text-3xl font-bold text-white">Crear Cuenta</h2>
              <p className="text-gray-400">Únete a la comunidad de gamers</p>
            </div>
          </div>

          {/* Formulario con glassmorphism */}
          <div
            className={`transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="nombre" className="label text-gray-300">
                      Nombre completo *
                    </label>
                    <input
                      {...register("nombre")}
                      id="nombre"
                      type="text"
                      autoComplete="name"
                      className={`input input-bordered w-full ${errors.nombre ? "input-error" : "input-primary"}`}
                      placeholder="Tu nombre completo"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.nombre.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label text-gray-300">
                      Correo electrónico *
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`input input-bordered w-full ${errors.email ? "input-error" : "input-primary"}`}
                      placeholder="tu@email.com"
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

                  {/* Teléfono */}
                  <div>
                    <label htmlFor="telefono" className="label text-gray-300">
                      Número de teléfono *
                    </label>
                    <input
                      {...register("telefono")}
                      id="telefono"
                      type="tel"
                      autoComplete="tel"
                      className={`input input-bordered w-full ${errors.telefono ? "input-error" : "input-primary"}`}
                      placeholder="612 345 678"
                      maxLength={11}
                      onChange={handlePhoneChange}
                    />
                    {errors.telefono ? (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.telefono.message}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        Formato: 612 345 678 (móviles empiezan por 6 o 7, fijos por 8 o 9)
                      </p>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label htmlFor="password" className="label text-gray-300">
                      Contraseña *
                    </label>
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`input input-bordered w-full ${errors.password ? "input-error" : "input-primary"}`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label htmlFor="confirmPassword" className="label text-gray-300">
                      Confirmar contraseña *
                    </label>
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : "input-primary"}`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start">
                  <input
                    {...register("acceptTerms")}
                    id="acceptTerms"
                    type="checkbox"
                    className="checkbox checkbox-primary mt-1"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
                    Acepto los{" "}
                    <Link to="/terminos" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link to="/privacidad" className="text-purple-400 hover:text-purple-300 transition-colors hover:underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.acceptTerms.message}
                  </p>
                )}

                {/* Botón de registro */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creando cuenta...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Crear Cuenta
                        <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {/* Link de login */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                  >
                    Inicia sesión aquí
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
