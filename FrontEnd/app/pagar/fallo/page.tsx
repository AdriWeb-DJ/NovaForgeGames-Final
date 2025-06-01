"use client"
import { useNavigate } from "react-router"

export default function PagoFallidoPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center py-16">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Pago no completado</h1>
        <p className="text-gray-400 mb-2">Hubo un problema al procesar tu pago.</p>
        <p className="text-red-400 font-semibold mb-8">No se ha realizado ningún cargo.</p>
        <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">¿Qué puedes hacer?</h3>
          <ul className="text-left text-gray-300 space-y-2">
            <li>• Revisa los datos de tu tarjeta o método de pago.</li>
            <li>• Si el problema persiste, contacta con soporte.</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate("/pagar")} className="btn-primary">
            Intentar de nuevo
          </button>
          <button onClick={() => navigate("/catalogo")} className="btn-outline">
            Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  )
}