from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, validator, Field
import re

# Esquemas para Rol
class RolBase(BaseModel):
    nombre_rol: str

class RolCreate(RolBase):
    pass

class Rol(RolBase):
    id_rol: int
    
    class Config:
        orm_mode = True

# Esquemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    email: str
    id_rol: int  # Cambiar de rol a id_rol
    is_active: Optional[bool] = True
    telefono: Optional[str] = None
    
    @validator('telefono')
    def validar_telefono_espanol(cls, v):
        if v is None:
            return v
        # Patrón para teléfonos españoles: +34 seguido de 9 dígitos o 9 dígitos empezando por 6, 7, 8 o 9
        patron = r'^(\+34|0034|34)?[ -]*(6|7|8|9)[ -]*([0-9][ -]*){8}$'
        if not re.match(patron, v):
            raise ValueError('El número de teléfono debe ser un número español válido')
        # Eliminar espacios y guiones para almacenar en formato estándar
        return re.sub(r'[ -]', '', v)

class UsuarioCreate(UsuarioBase):
    contraseña: str

class Usuario(UsuarioBase):
    id_usuario: int
    
    class Config:
        orm_mode = True

# Esquemas para actualización de Usuario
class UsuarioUpdate(BaseModel):
    nombre: str
    email: str
    id_rol: int
    telefono: str
    is_active: bool
    contraseña: Optional[str] = None

# Esquemas para Categoría
class CategoriaBase(BaseModel):
    nombre: str

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(CategoriaBase):
    id_categoria: int
    
    class Config:
        orm_mode = True

# Esquemas para Proveedor
class ProveedorBase(BaseModel):
    nombre: str
    contacto: Optional[str] = None

class ProveedorCreate(ProveedorBase):
    pass

class Proveedor(ProveedorBase):
    id_proveedor: int
    
    class Config:
        orm_mode = True

# Esquemas para Producto
class ProductoBase(BaseModel):
    nombre: str
    descripción: Optional[str] = None
    precio: float
    cantidad: int
    id_categoria: int
    id_proveedor: int
    imagen_url: Optional[str] = None

class ProductoCreate(ProductoBase):
    pass

class Producto(ProductoBase):
    id_producto: int
    id_producto_stripe: Optional[str] = None  # Cambiado de stripe_product_id
    id_precio_stripe: Optional[str] = None    # Cambiado de stripe_price_id
    
    class Config:
        orm_mode = True

# Esquemas para DetalleCompra
class DetalleCompraBase(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario: float

class DetalleCompraCreate(DetalleCompraBase):
    pass

class DetalleCompra(DetalleCompraBase):
    id_detalle: int
    id_compra: int
    
    class Config:
        orm_mode = True

# Esquemas para Compra
class CompraBase(BaseModel):
    id_usuario: int
    total: float

class CompraCreate(CompraBase):
    detalles: List[DetalleCompraCreate]

class Compra(CompraBase):
    id_compra: int
    fecha_compra: datetime
    detalles: List[DetalleCompra] = []
    
    class Config:
        orm_mode = True

# Esquemas para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Esquemas para Compra con detalles de Usuario
class CompraConUsuario(BaseModel):
    id_compra: int
    id_usuario: int
    usuario_nombre: str
    usuario_email: str
    fecha_compra: datetime
    total: float
    metodo_pago: str

    class Config:
        from_attributes = True