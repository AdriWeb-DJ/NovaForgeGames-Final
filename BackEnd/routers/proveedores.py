from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/proveedores",
    tags=["proveedores"],
    responses={404: {"description": "No encontrado"}},
)

@router.post("/", response_model=schemas.Proveedor, status_code=status.HTTP_201_CREATED)
def create_proveedor(proveedor: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    db_proveedor = models.Proveedor(
        nombre=proveedor.nombre,
        contacto=proveedor.contacto
    )
    db.add(db_proveedor)
    db.commit()
    db.refresh(db_proveedor)
    return db_proveedor

@router.get("/", response_model=List[schemas.Proveedor])
def read_proveedores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    proveedores = db.query(models.Proveedor).offset(skip).limit(limit).all()
    return proveedores

@router.get("/{proveedor_id}", response_model=schemas.Proveedor)
def read_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    db_proveedor = db.query(models.Proveedor).filter(models.Proveedor.id_proveedor == proveedor_id).first()
    if db_proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return db_proveedor

@router.put("/{proveedor_id}", response_model=schemas.Proveedor)
def update_proveedor(proveedor_id: int, proveedor: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    db_proveedor = db.query(models.Proveedor).filter(models.Proveedor.id_proveedor == proveedor_id).first()
    if db_proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    db_proveedor.nombre = proveedor.nombre
    db_proveedor.contacto = proveedor.contacto
    
    db.commit()
    db.refresh(db_proveedor)
    return db_proveedor

@router.delete("/{proveedor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    db_proveedor = db.query(models.Proveedor).filter(models.Proveedor.id_proveedor == proveedor_id).first()
    if db_proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    db.delete(db_proveedor)
    db.commit()
    return None