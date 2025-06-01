"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"

export default function AddToCartNotification() {
  const { cartItems, addedToCartNotification } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (addedToCartNotification !== null) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [addedToCartNotification])

  if (!isVisible || addedToCartNotification === null) return null

  const addedProduct = cartItems.find((item) => item.id_producto === addedToCartNotification)
  if (!addedProduct) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl border border-purple-500/30 p-4 max-w-sm animate-slide-up">
        <div className="flex items-center">
          <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden">
            <img
              src={addedProduct.imagen_url || `/placeholder.svg?height=80&width=80`}
              alt={addedProduct.nombre}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="ml-3">
            <h4 className="text-white font-medium">Añadido al carrito</h4>
            <p className="text-gray-300 text-sm line-clamp-1">{addedProduct.nombre}</p>
          </div>
          <div className="ml-auto">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
