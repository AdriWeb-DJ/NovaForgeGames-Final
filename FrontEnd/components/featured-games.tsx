"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"

interface Producto {
  id_producto: number
  nombre: string
  precio: number
  imagen_url?: string
  fecha_creacion?: string
}

const CARDS_PER_SLIDE = 3

export default function FeaturedGames() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/`)
        // Ordenar por fecha_creacion descendente si existe
        const sorted = [...res.data].sort((a, b) =>
          (b.fecha_creacion || "").localeCompare(a.fecha_creacion || "")
        )
        setProductos(sorted.slice(0, 8))
      } catch (e) {
        setProductos([])
      }
      setIsLoading(false)
    }
    fetchProductos()
  }, [])

  // Divide los productos en slides de 3, el último puede tener 2
  const slides: (Producto[] | null)[] = []
  for (let i = 0; i < 6; i += CARDS_PER_SLIDE) {
    slides.push(productos.slice(i, i + CARDS_PER_SLIDE))
  }
  // Si hay 8 productos, el último slide tendrá 2 productos
  if (productos.length === 8) {
    slides[2] = productos.slice(6, 8)
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-8 justify-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-[340px] h-[520px] bg-slate-700 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No hay juegos destacados.
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Carrusel */}
      <div className="relative w-full max-w-6xl overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            width: "100%",
            transform: `translateX(-${slide * 100}%)`,
          }}
        >
          {slides.map((slideProds, idx) => (
            <div
              key={idx}
              className="flex justify-center items-stretch gap-10 w-full"
              style={{
                flex: "none",
                width: "100%",
                minWidth: "100%",
                maxWidth: "100%",
              }}
            >
              {slideProds && slideProds.map((prod) => (
                <Link
                  to={`/producto/${prod.id_producto}`}
                  key={prod.id_producto}
                  className="w-[340px] h-[520px] bg-slate-800 rounded-2xl flex flex-col items-center justify-between shadow hover:bg-slate-700 transition p-8"
                  style={{
                    minWidth: "340px",
                    maxWidth: "340px",
                    minHeight: "520px",
                    maxHeight: "520px",
                  }}
                >
                  <div
                    className="w-full flex items-center justify-center mb-6"
                    style={{
                      height: "320px",
                      background: "#1e293b",
                      borderRadius: "1rem",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={prod.imagen_url || "/placeholder.svg?height=320&width=240"}
                      alt={prod.nombre}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                  <span className="text-xl font-bold text-white mb-2 text-center line-clamp-2">{prod.nombre}</span>
                  <span className="text-primary text-2xl font-semibold mb-4">{prod.precio.toFixed(2)} €</span>
                  <span className="btn btn-primary text-base text-gray-100">Ver más</span>
                </Link>
              ))}
              {/* Último slide: si hay solo 2 productos, añade el enlace al catálogo */}
              {idx === 2 && productos.length === 8 && slideProds && slideProds.length === 2 && (
                <Link
                  to="/catalogo"
                  className="w-[340px] h-[520px] bg-gradient-to-br from-purple-700 to-purple-400 rounded-2xl flex flex-col items-center justify-center shadow transition p-8 text-white font-bold text-2xl hover:scale-105"
                  style={{
                    minWidth: "340px",
                    maxWidth: "340px",
                    minHeight: "520px",
                    maxHeight: "520px",
                  }}
                >
                  <span className="mb-6">¿Quieres ver más?</span>
                  <span className="btn btn-outline btn-white text-lg">Ver catálogo completo</span>
                </Link>
              )}
            </div>
          ))}
        </div>
        {/* Flechas */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-3 shadow-lg z-10"
          onClick={() => setSlide((prev) => Math.max(prev - 1, 0))}
          disabled={slide === 0}
          style={{ opacity: slide === 0 ? 0.4 : 1 }}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-3 shadow-lg z-10"
          onClick={() => setSlide((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={slide === slides.length - 1}
          style={{ opacity: slide === slides.length - 1 ? 0.4 : 1 }}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Puntos del carrusel */}
      <div className="flex gap-2 mt-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${slide === idx ? "bg-primary" : "bg-slate-500"}`}
            onClick={() => setSlide(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
