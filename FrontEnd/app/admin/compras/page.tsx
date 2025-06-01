"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "@/context/auth-context"
import axios from "axios"

interface Purchase {
  id_compra: number
  id_usuario: number
  fecha_compra: string
  total: number
  productos: {
    nombre: string
    cantidad: number
    precio: number
  }[]
  direccion_envio?: string
}

export default function AdminComprasPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [purchaseDetails, setPurchaseDetails] = useState<any[]>([])
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  useEffect(() => {
    if (!user || user.id_rol !== 1) {
      navigate("/")
      return
    }

    const fetchCompras = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/compras/`)
        setPurchases(res.data)
      } catch (e) {
        setPurchases([])
      }
      setIsLoading(false)
    }

    fetchCompras()
  }, [user, navigate])

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.id_compra.toString().includes(searchTerm)
    return matchesSearch
  })

  const handleShowDetails = async (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setIsDetailsLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/detalles-compra/compra/${purchase.id_compra}`)
      setPurchaseDetails(res.data)
    } catch (e) {
      setPurchaseDetails([])
    }
    setIsDetailsLoading(false)
  }

  if (!user || user.id_rol !== 1) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Compras</h1>
        <p className="text-gray-400">Administra los pedidos de los clientes</p>
      </div>

      {/* Filtro */}
      <div className="bg-slate-800 rounded-lg p-6 border border-purple-900/30 mb-6">
        <div>
          <label className="label">Buscar pedido</label>
          <input
            type="text"
            className="input"
            placeholder="ID de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de compras */}
      <div className="bg-slate-800 rounded-lg border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cliente (ID)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
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
                        <div className="h-4 bg-slate-700 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-700 rounded w-24"></div>
                      </td>
                    </tr>
                  ))
                : filteredPurchases.map((purchase) => (
                    <tr key={purchase.id_compra} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">#{purchase.id_compra}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">Usuario #{purchase.id_usuario}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(purchase.fecha_compra).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">€{purchase.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => handleShowDetails(purchase)}
                          className="text-purple-400 hover:text-purple-300"
                          title="Ver detalles"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-purple-900/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Detalles del Pedido #{selectedPurchase.id_compra}</h2>
              <button onClick={() => setSelectedPurchase(null)} className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Información del cliente */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Información del Cliente</h3>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-white">
                    <strong>ID Usuario:</strong> {selectedPurchase.id_usuario}
                  </p>
                  {selectedPurchase.direccion_envio && (
                    <p className="text-white">
                      <strong>Dirección:</strong> {selectedPurchase.direccion_envio}
                    </p>
                  )}
                </div>
              </div>

              {/* Información del pedido */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Información del Pedido</h3>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-white">
                    <strong>Fecha:</strong> {new Date(selectedPurchase.fecha_compra).toLocaleString("es-ES")}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Productos</h3>
                <div className="space-y-2">
                  {isDetailsLoading ? (
                    <div className="text-gray-400">Cargando productos...</div>
                  ) : (
                    purchaseDetails.length > 0 ? (
                      purchaseDetails.map((producto, index) => (
                        <div key={index} className="bg-slate-700 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{producto.nombre}</p>
                            <p className="text-gray-400 text-sm">Cantidad: {producto.cantidad}</p>
                          </div>
                          <p className="text-white font-bold">
                            €{(
                              (Number(producto.precio_unitario ?? producto.precio ?? 0)) *
                              Number(producto.cantidad)
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">No hay productos en este pedido.</div>
                    )
                  )}
                </div>
                <div className="mt-4 bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total:</span>
                    <span className="text-lg font-bold text-white">€{selectedPurchase.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cerrar */}
              <div className="flex space-x-4">
                <button onClick={() => setSelectedPurchase(null)} className="btn-outline">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
