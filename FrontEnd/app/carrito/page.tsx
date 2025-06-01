"use client"
import { Link } from "react-router"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export default function CarritoPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-8">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-8">¡Explora nuestro catálogo y encuentra tus juegos favoritos!</p>
          <Link to="/catalogo" className="btn-primary">
            Explorar catálogo
          </Link>
        </div>
      </div>
    )
  }

  // El precio de cada producto YA incluye IVA
  const subtotalConIVA = getCartTotal()
  const subtotalSinIVA = subtotalConIVA / 1.21
  const iva = subtotalConIVA - subtotalSinIVA
  const total = subtotalConIVA

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id_producto} className="flex items-center space-x-4 py-4 border-b border-slate-700">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <img
                      src={item.imagen_url || `/placeholder.svg?height=80&width=80`}
                      alt={item.nombre}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-white">{item.nombre}</h3>
                    <p className="text-gray-400">{item.precio.toFixed(2)}€ c/u</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id_producto, item.cantidad - 1)}
                      className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-white">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id_producto, item.cantidad + 1)}
                      className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-white"
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

                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{(item.precio * item.cantidad).toFixed(2)}€</p>
                    <button
                      onClick={() => removeFromCart(item.id_producto)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm">
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal (sin IVA)</span>
                <span>{subtotalSinIVA.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>IVA (21%)</span>
                <span>{iva.toFixed(2)}€</span>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {!user && (
              <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <Link to="/login" className="underline">
                    Inicia sesión
                  </Link>{" "}
                  para continuar con la compra
                </p>
              </div>
            )}

            <Link
              to={user ? "/pagar" : "/login"}
              className="w-full btn-primary py-3 text-lg font-semibold block text-center"
            >
              {user ? `Pagar ${total.toFixed(2)}€` : "Iniciar sesión para pagar"}
            </Link>

            <div className="mt-4 text-center">
              <Link to="/catalogo" className="text-purple-400 hover:text-purple-300 text-sm">
                ← Continuar comprando
              </Link>
            </div>

            {/* Métodos de pago */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-gray-400 mb-3">Métodos de pago aceptados:</p>
              <div className="flex space-x-2">
                <div className="bg-slate-700 rounded p-2 text-center">
                  <span className="text-xs text-gray-300">💳 Tarjeta</span>
                </div>
                <div className="bg-slate-700 rounded p-2 text-center">
                  <span className="text-xs text-gray-300">🅿️ PayPal</span>
                </div>
                <div className="bg-slate-700 rounded p-2 text-center">
                  <span className="text-xs text-gray-300">📱 Bizum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
