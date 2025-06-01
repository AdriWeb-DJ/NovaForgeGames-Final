from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Table, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Modelo de Usuarios
class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    contraseña = Column(String, nullable=False)  # Almacenará el hash, no la contraseña en texto plano
    email = Column(String, unique=True, nullable=False)
    telefono = Column(String(15), nullable=True)  # Campo para teléfono español
    # Reemplazar el campo rol por id_rol con ForeignKey
    id_rol = Column(Integer, ForeignKey("roles.id_rol"), nullable=False)
    is_active = Column(Boolean, default=True)  # Para desactivar cuentas si es necesario
    
    # Relaciones
    compras = relationship("Compra", back_populates="usuario")
    # Renombrar para mayor claridad
    rol = relationship("Rol", back_populates="usuarios")

# Modelo de Roles
class Rol(Base):
    __tablename__ = "roles"
    
    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String, nullable=False, unique=True)
    
    # Relaciones
    usuarios = relationship("Usuario", back_populates="rol")

# Modelo de Productos
class Producto(Base):
    __tablename__ = "productos"
    
    id_producto = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripción = Column(String)
    precio = Column(Float, nullable=False)
    cantidad = Column(Integer, nullable=False)
    id_categoria = Column(Integer, ForeignKey("categorias.id_categoria"))
    id_proveedor = Column(Integer, ForeignKey("proveedores.id_proveedor"))
    id_producto_stripe = Column(String)  # Cambiado de stripe_product_id
    id_precio_stripe = Column(String)    # Cambiado de stripe_price_id
    imagen_url = Column(String)         # URL de la imagen del producto
    
    # Relaciones
    categoria = relationship("Categoria", back_populates="productos")
    proveedor = relationship("Proveedor", back_populates="productos")
    detalles = relationship("DetalleCompra", back_populates="producto")

# Modelo de Categorías
class Categoria(Base):
    __tablename__ = "categorias"
    
    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, unique=True)
    
    # Relaciones
    productos = relationship("Producto", back_populates="categoria")

# Modelo de Proveedores
class Proveedor(Base):
    __tablename__ = "proveedores"
    
    id_proveedor = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    contacto = Column(String)
    
    # Relaciones
    productos = relationship("Producto", back_populates="proveedor")

# Modelo de Compras
class Compra(Base):
    __tablename__ = "compras"
    
    id_compra = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    fecha_compra = Column(DateTime, default=func.now(), nullable=False)
    total = Column(Float, nullable=False)
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="compras")
    detalles = relationship("DetalleCompra", back_populates="compra")

# Tabla de relación entre Compras y Productos (Detalle_Compra)
class DetalleCompra(Base):
    __tablename__ = "detalle_compra"
    
    id_detalle = Column(Integer, primary_key=True, index=True)
    id_compra = Column(Integer, ForeignKey("compras.id_compra"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    
    # Relaciones
    compra = relationship("Compra", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles")