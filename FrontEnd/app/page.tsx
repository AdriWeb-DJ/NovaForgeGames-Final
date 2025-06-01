import { Link } from "react-router"
import FeaturedGames from "@/components/featured-games"
import CategorySection from "@/components/category-section"
import HeroSection from "@/components/hero-section"
import NewsletterSection from "@/components/newsletter-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <HeroSection />

      {/* Sección de Juegos Destacados */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Juegos Destacados</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded"></div>
        </div>
        <FeaturedGames />
      </section>

      {/* Sección de Categorías */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Explora por Categorías</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded"></div>
          </div>
          <CategorySection />
        </div>
      </section>

      {/* Sección de Comunidad */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Únete a la comunidad de NovaForgeGames</h2>
            <p className="mb-6">
              Descubre los mejores juegos, ofertas exclusivas y contenido especial para miembros. Regístrate hoy y obtén
              un <span className="font-semibold text-primary">10% de descuento</span> en tu primera compra.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
              <Link to="/catalogo" className="btn btn-outline btn-primary">Explorar catálogo</Link>
            </div>
          </div>
          <div className="relative h-48 md:h-64 overflow-hidden rounded-xl shadow-lg flex items-center justify-center bg-base-200">
            <img
              src="/placeholder.svg?height=160&width=240"
              alt="Comunidad de gamers"
              className="object-contain rounded-xl max-h-40"
            />
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}