"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router"

export interface CartItem {
  id_producto: number
  nombre: string
  precio: number
  cantidad: number
  imagen_url?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  showAddedToCartNotification: (productId: number) => void
  addedToCartNotification: number | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addedToCartNotification, setAddedToCartNotification] = useState<number | null>(null)
  const navigate = useNavigate()

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Cerrar notificación después de un tiempo
  useEffect(() => {
    if (addedToCartNotification !== null) {
      const timer = setTimeout(() => {
        setAddedToCartNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [addedToCartNotification])

  const addToCart = (product: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id_producto === product.id_producto)

      if (existingItem) {
        // Si el producto ya está en el carrito, actualizar cantidad
        return prevItems.map((item) =>
          item.id_producto === product.id_producto ? { ...item, cantidad: item.cantidad + product.cantidad } : item,
        )
      } else {
        // Si es un producto nuevo, añadirlo al carrito
        return [...prevItems, product]
      }
    })

    // Mostrar notificación
    showAddedToCartNotification(product.id_producto)

    // Abrir mini-carrito
    setIsCartOpen(true)

    // Cerrar mini-carrito después de un tiempo
    setTimeout(() => {
      setIsCartOpen(false)
    }, 4000)
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id_producto !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id_producto === productId ? { ...item, cantidad: quantity } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.cantidad, 0)
  }

  const showAddedToCartNotification = (productId: number) => {
    setAddedToCartNotification(productId)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen,
        showAddedToCartNotification,
        addedToCartNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider")
  }
  return context
}
