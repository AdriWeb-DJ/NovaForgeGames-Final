from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas
from payment.stripe_utils import crear_producto_stripe, crear_precio_stripe  # Nombres actualizados

router = APIRouter(
    prefix="/productos",
    tags=["productos"],
    responses={404: {"description": "No encontrado"}},
)

@router.post("/", response_model=schemas.Producto, status_code=status.HTTP_201_CREATED)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    # Verificar que la categoría existe
    db_categoria = db.query(models.Categoria).filter(models.Categoria.id_categoria == producto.id_categoria).first()
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Verificar que el proveedor existe
    db_proveedor = db.query(models.Proveedor).filter(models.Proveedor.id_proveedor == producto.id_proveedor).first()
    if db_proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    # Crear el producto en Stripe
    imagenes = [producto.imagen_url] if producto.imagen_url else []
    producto_stripe = crear_producto_stripe(
        nombre=producto.nombre,
        descripcion=producto.descripción,
        imagenes=imagenes
    )
    
    # Crear el precio en Stripe
    precio_stripe = crear_precio_stripe(
        id_producto=producto_stripe.id,
        precio_unitario=producto.precio
    )
    
    # Crear el producto en la base de datos
    db_producto = models.Producto(
        nombre=producto.nombre,
        descripción=producto.descripción,
        precio=producto.precio,
        cantidad=producto.cantidad,
        id_categoria=producto.id_categoria,
        id_proveedor=producto.id_proveedor,
        imagen_url=producto.imagen_url,
        id_producto_stripe=producto_stripe.id,  # Nombre actualizado
        id_precio_stripe=precio_stripe.id       # Nombre actualizado
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.get("/", response_model=List[schemas.Producto])
def read_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = db.query(models.Producto).offset(skip).limit(limit).all()
    return productos

@router.get("/{producto_id}", response_model=schemas.Producto)
def read_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.Producto).filter(models.Producto.id_producto == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.put("/{producto_id}", response_model=schemas.Producto)
def update_producto(producto_id: int, producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(models.Producto).filter(models.Producto.id_producto == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar que la categoría existe
    db_categoria = db.query(models.Categoria).filter(models.Categoria.id_categoria == producto.id_categoria).first()
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Verificar que el proveedor existe
    db_proveedor = db.query(models.Proveedor).filter(models.Proveedor.id_proveedor == producto.id_proveedor).first()
    if db_proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    db_producto.nombre = producto.nombre
    db_producto.descripción = producto.descripción
    db_producto.precio = producto.precio
    db_producto.cantidad = producto.cantidad
    db_producto.id_categoria = producto.id_categoria
    db_producto.id_proveedor = producto.id_proveedor
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.Producto).filter(models.Producto.id_producto == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db.delete(db_producto)
    db.commit()
    return None