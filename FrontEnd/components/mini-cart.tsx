"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useCart } from "@/context/cart-context"

export default function MiniCart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  if (cartItems.length === 0) {
    return (
      <div
        className={`absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-purple-900/30 overflow-hidden transition-all duration-300 transform ${
          isAnimating ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="p-4 text-center">
          <div className="text-gray-400 mb-2">Tu carrito está vacío</div>
          <Link to="/catalogo" className="text-sm text-purple-400 hover:text-purple-300">
            Explorar catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-purple-900/30 overflow-hidden transition-all duration-300 transform ${
        isAnimating ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-bold">Tu Carrito ({cartItems.length})</h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id_producto} className="p-3 border-b border-slate-700 flex items-center">
            <div className="relative h-14 w-14 flex-shrink-0 rounded overflow-hidden">
              <img
                src={item.imagen_url || `/placeholder.svg?height=80&width=80`}
                alt={item.nombre}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="ml-3 flex-grow">
              <h4 className="text-sm font-medium text-white line-clamp-1">{item.nombre}</h4>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="mx-2 text-sm text-gray-300">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-sm font-medium text-white">{(item.precio * item.cantidad).toFixed(2)}€</span>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id_producto)}
              className="ml-2 text-gray-400 hover:text-red-400"
              aria-label="Eliminar producto"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex justify-between mb-4">
          <span className="text-gray-300">Total:</span>
          <span className="text-white font-bold">{getCartTotal().toFixed(2)}€</span>
        </div>
        <div className="flex space-x-2">
          <Link to="/carrito" className="btn-primary py-2 text-sm flex-grow text-center">
            Ver carrito
          </Link>
          <Link to="/pagar" className="btn-secondary py-2 text-sm flex-grow text-center">
            Pagar
          </Link>
        </div>
      </div>
    </div>
  )
}
