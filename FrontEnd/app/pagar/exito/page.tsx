"use client"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useCart } from "@/context/cart-context"

export default function PagoExitosoPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // Opcional: podrías obtener el número de pedido de la query si Stripe lo devuelve
  }, [clearCart])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center py-16">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">¡Pago completado!</h1>
        <p className="text-gray-400 mb-2">Tu pedido ha sido procesado exitosamente.</p>
        <p className="text-purple-400 font-semibold mb-8">Gracias por tu compra en NovaForgeGames.</p>
        <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">¿Qué sigue?</h3>
          <ul className="text-left text-gray-300 space-y-2">
            <li>• Recibirás un email de confirmación.</li>
            <li>• Los juegos digitales estarán disponibles inmediatamente.</li>
            <li>• Puedes descargar tus juegos desde tu perfil.</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate("/perfil")} className="btn-primary">
            Ver mis juegos
          </button>
          <button onClick={() => navigate("/catalogo")} className="btn-outline">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  )
}