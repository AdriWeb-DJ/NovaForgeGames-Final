"use client"

import type React from "react"
import axios from "axios"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/auth-context"

interface Category {
  id_categoria: number
  nombre: string
  descripcion?: string
  productos_count: number
  fecha_creacion: string
  estado: "activa" | "inactiva"
}

const mockCategories: Category[] = [
  {
    id_categoria: 1,
    nombre: "Acción y Aventura",
    descripcion: "Juegos de acción, aventura y mundo abierto",
    productos_count: 45,
    fecha_creacion: "2024-01-01",
    estado: "activa",
  },
  {
    id_categoria: 2,
    nombre: "Deportes",
    descripcion: "Simuladores deportivos y juegos de deportes",
    productos_count: 23,
    fecha_creacion: "2024-01-01",
    estado: "activa",
  },
  {
    id_categoria: 3,
    nombre: "Estrategia",
    descripcion: "Juegos de estrategia en tiempo real y por turnos",
    productos_count: 34,
    fecha_creacion: "2024-01-01",
    estado: "activa",
  },
  {
    id_categoria: 4,
    nombre: "Shooter",
    descripcion: "Juegos de disparos en primera y tercera persona",
    productos_count: 28,
    fecha_creacion: "2024-01-01",
    estado: "activa",
  },
]

export default function AdminCategoriasPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })

  useEffect(() => {
    if (!user || user.id_rol !== 1) {
      navigate("/")
      return
    }

    // Cargar categorías reales del backend
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorias/`)
        console.log("Categorías recibidas:", res.data)
        setCategories(res.data)
      } catch (e) {
        setCategories([])
        console.error("Error cargando categorías", e)
      }
      setIsLoading(false)
    }

    fetchCategories()
  }, [user, navigate])

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (categoryId: number) => {
    const category = categories.find((c) => c.id_categoria === categoryId)
    if (category && category.productos_count > 0) {
      alert("No se puede eliminar una categoría que tiene productos asociados")
      return
    }

    if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categorias/${categoryId}`)
        setCategories(categories.filter((c) => c.id_categoria !== categoryId))
      } catch (e) {
        alert("Error al eliminar la categoría")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        // Actualizar categoría
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/categorias/${editingCategory.id_categoria}`,
          formData,
        )
        setCategories(
          categories.map((c) => (c.id_categoria === editingCategory.id_categoria ? res.data : c)),
        )
      } else {
        // Crear nueva categoría
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categorias/`, formData)
        setCategories([...categories, res.data])
      }
    } catch (e) {
      alert("Error al guardar la categoría")
    }

    setShowModal(false)
    setEditingCategory(null)
    setFormData({ nombre: "", descripcion: "" })
  }

  if (!user || user.id_rol !== 1) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Categorías</h1>
          <p className="text-gray-400">Administra las categorías de productos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            ))
          : categories.map((category) => (
              <div
                key={category.id_categoria}
                className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <span className="text-2xl">📂</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      category.estado === "activa" ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {category.estado}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{category.nombre}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{category.descripcion || "Sin descripción"}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">{category.productos_count}</span> productos
                  </div>
                  <div className="text-xs text-gray-500">
                    Creada: {new Date(category.fecha_creacion).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(category.id_categoria)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    disabled={category.productos_count > 0}
                    title={
                      category.productos_count > 0
                        ? "No se puede eliminar: tiene productos asociados"
                        : "Eliminar categoría"
                    }
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
              </div>
            ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-purple-900/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingCategory(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nombre de la categoría *</label>
                <input
                  type="text"
                  className="input"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Descripción</label>
                <textarea
                  className="input h-24 resize-none"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                  }}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? "Actualizar" : "Crear"} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
