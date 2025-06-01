"use client"

import type React from "react"
import axios from "axios"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/auth-context"

interface Product {
  id_producto: number
  nombre: string
  descripción: string | null
  precio: number
  cantidad: number
  id_categoria: number
  id_proveedor: number
  imagen_url: string | null
  categoria?: string
  proveedor?: string
  fecha_creacion?: string
  estado?: "activo" | "inactivo"
}

interface Proveedor {
  id_proveedor: number
  nombre: string
  contacto: string
}

const mockProducts: Product[] = [
  {
    id_producto: 1,
    nombre: "Cyberpunk 2077",
    descripción: "Un RPG de acción y aventura de mundo abierto ambientado en Night City",
    precio: 59.99,
    cantidad: 100,
    id_categoria: 1,
    id_proveedor: 1,
    imagen_url: null,
    categoria: "Acción y Aventura",
    proveedor: "CD Projekt",
    fecha_creacion: "2024-01-15",
    estado: "activo",
  },
  {
    id_producto: 2,
    nombre: "The Witcher 3: Wild Hunt",
    descripción: "Un juego de rol de mundo abierto con una trama impulsada por decisiones",
    precio: 39.99,
    cantidad: 50,
    id_categoria: 1,
    id_proveedor: 1,
    imagen_url: null,
    categoria: "Acción y Aventura",
    proveedor: "CD Projekt",
    fecha_creacion: "2024-01-10",
    estado: "activo",
  },
  {
    id_producto: 3,
    nombre: "Elden Ring",
    descripción: "Un RPG de acción desarrollado por FromSoftware",
    precio: 69.99,
    cantidad: 75,
    id_categoria: 1,
    id_proveedor: 2,
    imagen_url: null,
    categoria: "Acción y Aventura",
    proveedor: "FromSoftware",
    fecha_creacion: "2024-01-08",
    estado: "activo",
  },
]

export default function AdminProductosPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [categorias, setCategorias] = useState<{ id_categoria: number; nombre: string }[]>([])
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)

  useEffect(() => {
    if (!user || user.id_rol !== 1) {
      navigate("/")
      return
    }

    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/`)
        setProducts(res.data)
      } catch (e) {
        setProducts([])
      }
      setIsLoading(false)
    }

    const fetchProveedores = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/proveedores/`)
        setProveedores(res.data)
      } catch (e) {
        setProveedores([])
      }
    }

    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorias/`)
        setCategorias(res.data)
      } catch (e) {
        setCategorias([])
      }
    }

    fetchProducts()
    fetchProveedores()
    fetchCategorias()
  }, [user, navigate])

  const [formData, setFormData] = useState({
    nombre: "",
    descripción: "",
    precio: "",
    cantidad: "",
    id_categoria: "",
    id_proveedor: "",
    imagen_url: "",
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      descripción: product.descripción || "",
      precio: product.precio.toString(),
      cantidad: product.cantidad.toString(),
      id_categoria: product.id_categoria.toString(),
      id_proveedor: product.id_proveedor.toString(),
      imagen_url: product.imagen_url || "",
    })
    setShowModal(true)
  }

  // MODAL DE CONFIRMACIÓN PARA BORRAR
  const handleDelete = (productId: number) => {
    setDeleteProductId(productId)
  }

  const confirmDelete = async () => {
    if (deleteProductId === null) return
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/productos/${deleteProductId}`)
      setProducts(products.filter((p) => p.id_producto !== deleteProductId))
    } catch (e) {
      alert("Error al eliminar el producto")
    }
    setDeleteProductId(null)
  }

  const cancelDelete = () => {
    setDeleteProductId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      nombre: formData.nombre,
      descripción: formData.descripción,
      precio: Number.parseFloat(formData.precio),
      cantidad: Number.parseInt(formData.cantidad),
      id_categoria: Number.parseInt(formData.id_categoria),
      id_proveedor: Number.parseInt(formData.id_proveedor),
      imagen_url: formData.imagen_url || null,
    }

    try {
      if (editingProduct) {
        // Actualizar producto existente
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/productos/${editingProduct.id_producto}`,
          productData
        )
        setProducts(products.map((p) => (p.id_producto === editingProduct.id_producto ? res.data : p)))
      } else {
        // Crear nuevo producto
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/productos/`,
          productData
        )
        setProducts([...products, res.data])
      }
    } catch (e) {
      alert("Error al guardar el producto")
    }

    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      nombre: "",
      descripción: "",
      precio: "",
      cantidad: "",
      id_categoria: "",
      id_proveedor: "",
      imagen_url: "",
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "" || product.id_categoria.toString() === filterCategory
    return matchesSearch && matchesCategory
  })

  if (!user || user.id_rol !== 1) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
          <p className="text-gray-400">Administra el catálogo de videojuegos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Buscar producto</label>
            <input
              type="text"
              className="input"
              placeholder="Nombre del producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Filtrar por categoría</label>
            <select className="input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("")
              }}
              className="btn-outline w-full"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-slate-800 rounded-lg border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-slate-700 rounded"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-slate-700 rounded w-24"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-12"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-20"></div>
                      </td>
                    </tr>
                  ))
                : filteredProducts.map((product) => (
                    <tr key={product.id_producto} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <img
                              src={product.imagen_url || `/placeholder.svg?height=48&width=48`}
                              alt={product.nombre}
                              className="object-cover rounded w-full h-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.nombre}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {product.descripción || "Sin descripción"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {categorias.find((cat) => cat.id_categoria === product.id_categoria)?.nombre || "Sin categoría"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{product.precio.toFixed(2)}€</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.cantidad > 50
                              ? "bg-green-900/30 text-green-300"
                              : product.cantidad > 10
                                ? "bg-yellow-900/30 text-yellow-300"
                                : "bg-red-900/30 text-red-300"
                          }`}
                        >
                          {product.cantidad} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEdit(product)} className="text-purple-400 hover:text-purple-300">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id_producto)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-purple-900/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingProduct(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nombre del producto *</label>
                  <input
                    type="text"
                    className="input"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    required
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Descripción</label>
                <textarea
                  className="input h-24 resize-none"
                  value={formData.descripción}
                  onChange={(e) => setFormData({ ...formData, descripción: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Cantidad en stock *</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Categoría *</label>
                  <select
                    className="input"
                    required
                    value={formData.id_categoria}
                    onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Proveedor *</label>
                  <select
                    className="input"
                    required
                    value={formData.id_proveedor}
                    onChange={(e) => setFormData({ ...formData, id_proveedor: e.target.value })}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((prov) => (
                      <option key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">URL de imagen</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                  }}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? "Actualizar" : "Crear"} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {deleteProductId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-purple-900/30">
            <h2 className="text-xl font-bold text-white mb-4">¿Eliminar producto?</h2>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelDelete} className="btn-outline">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
