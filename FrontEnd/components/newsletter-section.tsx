"use client"

import type React from "react"

import { useState } from "react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Simulación de envío
    try {
      // Aquí iría la lógica real de envío a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setEmail("")
    } catch (err) {
      setError("Ocurrió un error al suscribirte. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Mantente informado</h2>
          <p className="text-gray-300 mb-8">
            Suscríbete a nuestro boletín para recibir las últimas noticias, ofertas exclusivas y lanzamientos de juegos.
          </p>

          {isSuccess ? (
            <div className="bg-green-900/30 border border-green-500 text-green-300 rounded-lg p-4 mb-6">
              ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="input flex-grow"
              />
              <button type="submit" disabled={isSubmitting} className="btn-primary whitespace-nowrap">
                {isSubmitting ? "Enviando..." : "Suscribirse"}
              </button>
            </form>
          )}

          {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
        </div>
      </div>
    </section>
  )
}
