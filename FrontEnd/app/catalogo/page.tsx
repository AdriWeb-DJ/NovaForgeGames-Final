"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router"
import { useCart } from "@/context/cart-context"
import axios from "axios"

interface Product {
  id_producto: number
  nombre: string
  descripción: string | null // <--- sin tilde
  precio: number
  cantidad: number
  id_categoria: number
  id_proveedor: number
  imagen_url: string | null
}

interface Category {
  id_categoria: number
  nombre: string
}

export default function CatalogoPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get("categoria")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryParam ? Number.parseInt(categoryParam) : null,
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [sortBy, setSortBy] = useState<string>("nombre")
  const { addToCart } = useCart()

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorias/`)
        ])
        setProducts(prodRes.data)
        setCategories(catRes.data)
        if (prodRes.data.length > 0) {
          const precios = prodRes.data.map((p: Product) => p.precio)
          setPriceRange([Math.min(...precios), Math.max(...precios)])
        }
      } catch (e) {
        // Manejo de error simple
        setProducts([])
        setCategories([])
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id_producto: product.id_producto,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: 1,
      imagen_url: product.imagen_url || undefined,
    })
  }

  const filteredProducts = products
    .filter(
      (product) =>
        (selectedCategory === null || product.id_categoria === selectedCategory) &&
        product.precio >= priceRange[0] &&
        product.precio <= priceRange[1],
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "precio-asc":
          return a.precio - b.precio
        case "precio-desc":
          return b.precio - a.precio
        case "nombre":
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="h-48 bg-slate-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Juegos</h1>
        <p className="text-gray-400">Descubre los mejores videojuegos al mejor precio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar con filtros */}
        <div className="md:col-span-1">
          <div className="bg-slate-800 p-6 rounded-lg sticky top-24 border border-purple-900/30">
            <h2 className="text-xl font-bold mb-6 text-white">Filtros</h2>

            {/* Filtro por categoría */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Categoría</h3>
              <select
                className="w-full bg-slate-700 text-white rounded-lg py-3 px-4 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                value={selectedCategory === null ? "" : selectedCategory.toString()}
                onChange={(e) => setSelectedCategory(e.target.value === "" ? null : Number(e.target.value))}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id_categoria} value={category.id_categoria}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por rango de precio */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Precio</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                className="w-full accent-purple-600 mb-2"
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>

            {/* Ordenar por */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-200">Ordenar por</h3>
              <select
                className="w-full bg-slate-700 text-white rounded-lg py-3 px-4 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="nombre">Nombre A-Z</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listado de productos */}
        <div className="md:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-gray-400">
              Mostrando <span className="text-white font-semibold">{filteredProducts.length}</span> de{" "}
              <span className="text-white font-semibold">{products.length}</span> juegos
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id_producto} className="card group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.imagen_url || `/placeholder.svg?height=300&width=400`}
                    alt={product.nombre}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.cantidad <= 0 && (
                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">Agotado</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link to={`${product.id_producto}`} className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                    {product.nombre}
                  </Link>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.descripción || "Sin descripción disponible"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">{product.precio.toFixed(2)}€</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.cantidad <= 0}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        product.cantidad > 0
                          ? "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {product.cantidad > 0 ? "Añadir" : "Agotado"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No se encontraron juegos</h3>
              <p className="text-gray-400">Intenta ajustar los filtros para ver más resultados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
