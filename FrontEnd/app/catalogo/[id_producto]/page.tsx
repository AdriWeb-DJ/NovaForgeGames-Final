"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useCart } from "@/context/cart-context"
import axios from "axios"

interface Producto {
  id_producto: number
  nombre: string
  descripción?: string
  precio: number
  imagen_url?: string
}

export default function ProductoPage() {
  const { id_producto } = useParams<{ id_producto: string }>()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducto = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/${id_producto}`)
        setProducto(res.data)
      } catch (e) {
        setProducto(null)
      }
      setIsLoading(false)
    }
    fetchProducto()
  }, [id_producto])

  if (isLoading) {
    return <div className="text-center py-16">Cargando producto...</div>
  }

  if (!producto) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Producto no encontrado.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/catalogo")}>
          Volver al catálogo
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen_url: producto.imagen_url,
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 bg-slate-800 rounded-2xl shadow-lg p-8">
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src={producto.imagen_url || "/placeholder.svg?height=320&width=240"}
            alt={producto.nombre}
            className="object-contain rounded-lg shadow bg-slate-900"
            style={{ maxWidth: 400, maxHeight: 400, width: "100%", height: "auto" }}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">{producto.nombre}</h1>
          <p className="text-2xl text-primary font-semibold mb-4">{producto.precio.toFixed(2)} €</p>
          <p className="mb-8 text-gray-300">{producto.descripción || "Sin descripción."}</p>
          <button className="btn btn-primary w-full md:w-auto" onClick={handleAddToCart}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}