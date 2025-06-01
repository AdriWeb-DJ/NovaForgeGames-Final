from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/detalles-compra",
    tags=["detalles-compra"],
    responses={404: {"description": "No encontrado"}},
)

@router.get("/", response_model=List[schemas.DetalleCompra])
def read_detalles_compra(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    detalles = db.query(models.DetalleCompra).offset(skip).limit(limit).all()
    return detalles

@router.get("/{detalle_id}", response_model=schemas.DetalleCompra)
def read_detalle_compra(detalle_id: int, db: Session = Depends(get_db)):
    db_detalle = db.query(models.DetalleCompra).filter(models.DetalleCompra.id_detalle == detalle_id).first()
    if db_detalle is None:
        raise HTTPException(status_code=404, detail="Detalle de compra no encontrado")
    return db_detalle

@router.get("/compra/{compra_id}", response_model=List[schemas.DetalleCompra])
def read_detalles_by_compra(compra_id: int, db: Session = Depends(get_db)):
    detalles = db.query(models.DetalleCompra).filter(models.DetalleCompra.id_compra == compra_id).all()
    return detalles