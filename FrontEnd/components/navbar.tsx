"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import MiniCart from "@/components/mini-cart"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname
  const { cartItems, getCartCount, isCartOpen, setIsCartOpen } = useCart()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node) && isCartOpen) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCartOpen, setIsCartOpen])

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/catalogo" },
  ]

  if (user && user.id_rol == 1) {
    navLinks.push({ name: "Admin", href: "/admin" })
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="relative h-10 w-10 mr-3">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-800 rounded-full animate-pulse"></div>
                <div className="absolute inset-0.5 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                    N
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                NovaForge<span className="text-purple-500">Games</span>
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    pathname === link.href || (link.href === "/admin" && pathname.startsWith("/admin"))
                      ? "border-purple-500 text-white"
                      : "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                  } ${link.name === "Admin" ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-t-lg px-3" : ""}`}
                >
                  {link.name === "Admin" && "👑 "}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <div className="flex-shrink-0 relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 rounded-full hover:bg-slate-700 relative"
                aria-label="Carrito de compras"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {isCartOpen && <MiniCart />}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <Link to="/perfil" className="text-sm font-medium text-gray-300 hover:text-white">
                      {user.rol === "admin" && "👑 "}
                      {user.nombre}
                    </Link>
                    <button onClick={logout} className="text-sm font-medium text-gray-300 hover:text-white">
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="btn-outline py-1 px-3 text-sm">
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" className="btn-primary py-1 px-3 text-sm">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-blue-900/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href || (link.href === "/admin" && pathname.startsWith("/admin"))
                    ? "bg-purple-900/30 text-white"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                } ${link.name === "Admin" ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name === "Admin" && "👑 "}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-900/30">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Link to="/carrito" className="p-2 rounded-full hover:bg-slate-700 relative inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {getCartCount() > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </div>
              <div className="ml-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-base font-medium leading-none text-white">
                      {user.rol === "admin" && "👑 "}
                      {user.nombre}
                    </div>
                    <Link
                      to="/perfil"
                      className="text-sm font-medium text-gray-300 hover:text-white block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    {user.rol === "admin" && (
                      <Link
                        to="/admin"
                        className="text-sm font-medium text-purple-400 hover:text-purple-300 block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        👑 Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-gray-300 hover:text-white block"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block text-base font-medium text-gray-300 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="block text-base font-medium text-gray-300 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
