from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/compras",
    tags=["compras"],
    responses={404: {"description": "No encontrado"}},
)

@router.post("/", response_model=schemas.Compra, status_code=status.HTTP_201_CREATED)
def create_compra(compra: schemas.CompraCreate, db: Session = Depends(get_db)):
    # Verificar que el usuario existe
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == compra.id_usuario).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Crear la compra
    db_compra = models.Compra(
        id_usuario=compra.id_usuario,
        total=compra.total
    )
    db.add(db_compra)
    db.commit()
    db.refresh(db_compra)
    
    # Crear los detalles de la compra
    for detalle in compra.detalles:
        # Verificar que el producto existe
        db_producto = db.query(models.Producto).filter(models.Producto.id_producto == detalle.id_producto).first()
        if db_producto is None:
            raise HTTPException(status_code=404, detail=f"Producto con ID {detalle.id_producto} no encontrado")
        
        # Verificar stock disponible
        if db_producto.cantidad < detalle.cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para el producto {db_producto.nombre}")
        
        # Actualizar stock del producto
        db_producto.cantidad -= detalle.cantidad
        
        # Crear el detalle de compra
        db_detalle = models.DetalleCompra(
            id_compra=db_compra.id_compra,
            id_producto=detalle.id_producto,
            cantidad=detalle.cantidad,
            precio_unitario=detalle.precio_unitario
        )
        db.add(db_detalle)
    
    db.commit()
    db.refresh(db_compra)
    return db_compra

@router.get("/", response_model=List[schemas.CompraConUsuario])
def read_compras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    compras = db.query(models.Compra).offset(skip).limit(limit).all()
    compras_con_usuario = []
    for compra in compras:
        usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == compra.id_usuario).first()
        compras_con_usuario.append({
            "id_compra": compra.id_compra,
            "id_usuario": compra.id_usuario,
            "usuario_nombre": usuario.nombre if usuario else "",
            "usuario_email": usuario.email if usuario else "",
            "fecha_compra": compra.fecha_compra,
            "total": compra.total,
            "metodo_pago": getattr(compra, "metodo_pago", "Tarjeta") or "Tarjeta", 
        })
    return compras_con_usuario

@router.get("/{compra_id}", response_model=schemas.Compra)
def read_compra(compra_id: int, db: Session = Depends(get_db)):
    db_compra = db.query(models.Compra).filter(models.Compra.id_compra == compra_id).first()
    if db_compra is None:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return db_compra

@router.get("/usuario/{usuario_id}", response_model=List[schemas.Compra])
def read_compras_by_usuario(usuario_id: int, db: Session = Depends(get_db)):
    compras = db.query(models.Compra).filter(models.Compra.id_usuario == usuario_id).all()
    return compras
