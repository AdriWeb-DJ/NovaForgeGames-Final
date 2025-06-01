"use client"

import { useState } from "react"
import { Link } from "react-router"
import { useCart } from "@/context/cart-context"

interface Product {
  id_producto: number
  nombre: string
  descripción: string | null
  precio: number
  cantidad: number
  imagen_url: string | null
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addedToCartNotification } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    onAddToCart()

    // Simular un pequeño retraso para la animación
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  const isJustAdded = addedToCartNotification === product.id_producto

  return (
    <div className="card group relative overflow-hidden">
      {/* Badge de oferta */}
      {product.precio < 50 && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          OFERTA
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imagen_url || `/placeholder.svg?height=300&width=400`}
          alt={product.nombre}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.cantidad <= 0 && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">Agotado</span>
          </div>
        )}

        {/* Overlay con botón de vista rápida */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            to={`/producto/${product.id_producto}`}
            className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
          >
            Vista rápida
          </Link>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/producto/${product.id_producto}`}>
          <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.nombre}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.descripción || "Sin descripción disponible"}</p>

        {/* Rating simulado */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`h-3 w-3 ${i < 4 ? "fill-current" : "text-gray-600"}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-xs ml-1">(4.0)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{product.precio.toFixed(2)}€</span>
            {product.precio < 50 && (
              <span className="text-sm text-gray-500 line-through">{(product.precio * 1.2).toFixed(2)}€</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.cantidad <= 0 || isAddingToCart}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
              product.cantidad > 0
                ? "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            } ${isJustAdded ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-800" : ""}`}
          >
            <span className={`transition-all duration-300 ${isAddingToCart ? "opacity-0" : "opacity-100"}`}>
              {product.cantidad > 0 ? "Añadir" : "Agotado"}
            </span>

            {/* Animación de carga */}
            {isAddingToCart && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notificación de añadido al carrito */}
      {isJustAdded && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full animate-bounce">
          ¡Añadido!
        </div>
      )}
    </div>
  )
}
