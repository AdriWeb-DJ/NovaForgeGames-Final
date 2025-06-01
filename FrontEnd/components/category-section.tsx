import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion?: string
  // añade más campos si tu modelo los tiene
}

export default function CategorySection() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategorias = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categorias/`)
        setCategorias(res.data)
      } catch (e) {
        setCategorias([])
      }
      setIsLoading(false)
    }
    fetchCategorias()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-6 justify-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-48 h-28 bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No hay categorías registradas.
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {categorias.map((cat) => (
        <Link
          to={`/catalogo?categoria=${cat.id_categoria}`}
          key={cat.id_categoria}
          className="w-48 h-28 bg-slate-800 rounded-lg flex flex-col items-center justify-center shadow hover:bg-slate-700 transition"
        >
          <span className="text-lg font-bold text-white mb-1">{cat.nombre}</span>
          <span className="text-gray-400 text-sm text-center px-2 line-clamp-2">{cat.descripcion || ""}</span>
        </Link>
      ))}
    </div>
  )
}
