import {
  type RouteConfig,
  route,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  // Página principal
  index("./page.tsx"),

  // Rutas de administración agrupadas
  ...prefix("admin", [
    // Panel principal de administración
    index("./admin/page.tsx"),
    // Subpáginas de administración
    route("categorias", "./admin/categorias/page.tsx"),
    route("compras", "./admin/compras/page.tsx"),
    route("productos", "./admin/productos/page.tsx"),
  ]),

  // Rutas públicas
  route("carrito", "./carrito/page.tsx"),
  route("catalogo", "./catalogo/page.tsx"),
  route("catalogo/:id_producto", "./catalogo/[id_producto]/page.tsx"),
  route("confirmar-email", "./confirmar-email/page.tsx"),
  route("login", "./login/page.tsx"),
  ...prefix("pagar", [index("./pagar/page.tsx"), route("exito", "./pagar/exito/page.tsx"), route("fallo", "./pagar/fallo/page.tsx")]),
  route("perfil", "./perfil/page.tsx"),
  route("recuperar-password", "./recuperar-password/page.tsx"),
  route("resetear-contraseña", "./recuperar-password/reset.tsx"),
  route("reenviar-confirmacion", "./reenviar-confirmacion/page.tsx"),
  route("registro", "./registro/page.tsx"),
] satisfies RouteConfig;
