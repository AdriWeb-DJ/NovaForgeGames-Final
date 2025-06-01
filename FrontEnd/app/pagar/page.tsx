"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import axios from "axios"

export default function PagarPage() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/catalogo")
    }
  }, [cartItems, navigate])

  const total = getCartTotal()

  const handlePayment = async () => {
    setIsProcessing(true)
    setErrors({})
    try {
      // Llama al backend para crear la sesión de pago
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/crear-sesion-pago`,
        cartItems.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad
        })),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
      // Redirige a Stripe
      window.location.href = response.data.url_pago
    } catch (error) {
      setErrors({ payment: "Error al procesar el pago. Inténtalo de nuevo." })
    } finally {
      setIsProcessing(false)
    }
  }

  

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">Inicia sesión para continuar</h1>
          <p className="text-gray-400 mb-8">Necesitas una cuenta para realizar el pago</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Finalizar compra</h1>
        <p className="text-gray-400">Revisa tu pedido y paga de forma segura</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
        <h2 className="text-xl font-bold text-white mb-6">Resumen del pedido</h2>
        {/* Productos */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id_producto} className="flex items-center">
              <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden">
                <img
                  src={item.imagen_url || `/placeholder.svg?height=80&width=80`}
                  alt={item.nombre}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-3 flex-grow">
                <h4 className="text-sm font-medium text-white line-clamp-1">{item.nombre}</h4>
                <p className="text-gray-400 text-sm">Cantidad: {item.cantidad}</p>
              </div>
              <span className="text-sm font-medium text-white">{(item.precio * item.cantidad).toFixed(2)}€</span>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="border-t border-slate-700 pt-4 flex justify-between text-xl font-bold text-white">
          <span>Total</span>
          <span>{total.toFixed(2)}€</span>
        </div>
        {errors.payment && <p className="text-red-400 text-sm mt-4">{errors.payment}</p>}
        {/* Botón de pago */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full btn-primary py-3 text-lg font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
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
              Procesando pago...
            </div>
          ) : (
            `Pagar ${total.toFixed(2)}€`
          )}
        </button>
        {/* Seguridad */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Pago seguro con SSL
          </div>
          <p className="text-xs text-gray-500 mt-2">Tus datos están protegidos con encriptación de 256 bits</p>
        </div>
      </div>
    </div>
  )
}
