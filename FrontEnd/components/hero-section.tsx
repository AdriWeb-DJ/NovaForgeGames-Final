"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsLoaded(true)

    // Configuración de la animación de partículas
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear partículas
    const particlesArray: Particle[] = []
    const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 20))

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1

        // Colores temáticos de la página
        const colors = ["#6a26cd", "#1e3a8a", "#8520ff", "#3b82f6"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Rebote en los bordes
        if (canvas && (this.x > canvas.width || this.x < 0)) {
          this.speedX = -this.speedX
        }
        if (canvas && (this.y > canvas.height || this.y < 0)) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Inicializar partículas
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Dibujar líneas entre partículas cercanas
    function connect() {
      if (!ctx) return
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(106, 38, 205, ${0.8 - distance / 100})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Función de animación
    function animate() {
      if (!ctx) return
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Actualizar y dibujar partículas
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      connect()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Canvas para animación de partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-gradient-to-b from-dark to-dark-light"></canvas>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 to-transparent z-1"></div>

      {/* Contenido del hero con animación de entrada */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
        <div
          className={`max-w-3xl transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-900/50 backdrop-blur-sm border border-purple-500/20">
            <p className="text-sm text-purple-300 font-medium">¡Bienvenido a NovaForgeGames!</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Descubre el universo de los{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-x">
              videojuegos
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Explora nuestra colección de los mejores títulos a precios increíbles. Desde AAA hasta indies, tenemos todo
            lo que buscas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalogo" className="btn-primary group relative overflow-hidden">
              <span className="relative z-10">Explorar catálogo</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link to="/ofertas" className="btn-outline group">
              <span>Ver ofertas</span>
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent z-10"></div>

      {/* Scroll indicator con animación */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  )
}
