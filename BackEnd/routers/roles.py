from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas

router = APIRouter(
    prefix="/roles",
    tags=["roles"],
    responses={404: {"description": "No encontrado"}},
)

@router.post("/", response_model=schemas.Rol, status_code=status.HTTP_201_CREATED)
def create_rol(rol: schemas.RolCreate, db: Session = Depends(get_db)):
    db_rol = models.Rol(nombre_rol=rol.nombre_rol)
    db.add(db_rol)
    db.commit()
    db.refresh(db_rol)
    return db_rol

@router.get("/", response_model=List[schemas.Rol])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = db.query(models.Rol).offset(skip).limit(limit).all()
    return roles

@router.get("/{rol_id}", response_model=schemas.Rol)
def read_rol(rol_id: int, db: Session = Depends(get_db)):
    db_rol = db.query(models.Rol).filter(models.Rol.id_rol == rol_id).first()
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return db_rol

@router.put("/{rol_id}", response_model=schemas.Rol)
def update_rol(rol_id: int, rol: schemas.RolCreate, db: Session = Depends(get_db)):
    db_rol = db.query(models.Rol).filter(models.Rol.id_rol == rol_id).first()
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    db_rol.nombre_rol = rol.nombre_rol
    
    db.commit()
    db.refresh(db_rol)
    return db_rol

@router.delete("/{rol_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rol(rol_id: int, db: Session = Depends(get_db)):
    db_rol = db.query(models.Rol).filter(models.Rol.id_rol == rol_id).first()
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    db.delete(db_rol)
    db.commit()
    return None