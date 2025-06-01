from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from passlib.context import CryptContext

load_dotenv()

from database import get_db
import models, schemas
from auth import jwt as auth_jwt  # Asegúrate de que el import es correcto

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"],
    responses={404: {"description": "No encontrado"}},
)

SECRET_KEY = os.getenv("SECRET_KEY")  # Usa una variable de entorno en producción
ALGORITHM = os.getenv("ALGORITHM")

conf = ConnectionConfig(
    MAIL_USERNAME = "novaforgegamesstore@gmail.com",
    MAIL_PASSWORD = "vezm vpqf acoe gzew",
    MAIL_FROM = "novaforgegamesstore@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,      # <--- Cambia esto
    MAIL_SSL_TLS = False,      # <--- Cambia esto
    USE_CREDENTIALS = True
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/confirmar-email")
def confirmar_email(token: str, db: Session = Depends(get_db)):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    # Validar tipos y datos
    email = data.get("email")
    nombre = data.get("nombre")
    contraseña = data.get("contraseña")
    telefono = data.get("telefono")
    id_rol = data.get("id_rol")
    is_active = data.get("is_active", True)

    # Validaciones básicas
    if not all([email, nombre, contraseña, telefono, id_rol]):
        raise HTTPException(status_code=400, detail="Datos incompletos en el token")

    # Forzar id_rol a int y comprobar que es válido
    try:
        id_rol_int = int(id_rol)
    except Exception:
        raise HTTPException(status_code=400, detail=f"El rol debe ser un número válido. Valor recibido: {id_rol}")

    # Verifica si el usuario ya existe
    db_usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # Crea el usuario
    db_usuario = models.Usuario(
        nombre=nombre,
        email=email,
        contraseña=pwd_context.hash(contraseña),  # Hashea aquí
        id_rol=id_rol_int,
        is_active=is_active,
        telefono=telefono
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return {"msg": "Usuario confirmado y registrado correctamente"}

@router.post("/", response_model=schemas.Usuario)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    db_usuario = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Crear el usuario con la contraseña ya hasheada desde el frontend
    db_usuario = models.Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        contraseña=pwd_context.hash(usuario.contraseña),  # Hashea aquí
        id_rol=usuario.id_rol,
        is_active=usuario.is_active,
        telefono=usuario.telefono
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@router.get("/", response_model=List[schemas.Usuario])
def read_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).offset(skip).limit(limit).all()
    return usuarios

@router.get("/{usuario_id}", response_model=schemas.Usuario)
def read_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario

@router.put("/{usuario_id}", response_model=schemas.Usuario)
def update_usuario(usuario_id: int, usuario: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db_usuario.nombre = usuario.nombre
    db_usuario.email = usuario.email
    db_usuario.id_rol = usuario.id_rol
    db_usuario.telefono = usuario.telefono
    db_usuario.is_active = usuario.is_active
    if usuario.contraseña:
        db_usuario.contraseña = usuario.contraseña
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(db_usuario)
    db.commit()
    return None

@router.post("/pre-registro")
async def pre_registro(usuario: schemas.UsuarioCreate):
    # Genera un token de confirmación
    token_data = {
        "email": usuario.email,
        "nombre": usuario.nombre,
        "contraseña": usuario.contraseña,
        "telefono": usuario.telefono,
        "id_rol": int(usuario.id_rol),  # <-- fuerza a int aquí también
        "is_active": usuario.is_active
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Enlace de confirmación
    confirm_url = f"{os.getenv('FRONTEND_URL')}/confirmar-email?token={token}"

    # Envía el email
    message = MessageSchema(
        subject="Confirma tu registro en NovaForgeGames",
        recipients=[usuario.email],
        body=f"Hola {usuario.nombre}, haz clic en el siguiente enlace para confirmar tu registro: {confirm_url}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"msg": "Email de confirmación enviado"}

@router.post("/login")
def login(
    email: str = Body(...),
    password: str = Body(...),
    db: Session = Depends(get_db)
):
    user = auth_jwt.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=400, detail="Email o contraseña incorrectos")
    # Crea el token de acceso
    access_token = auth_jwt.create_access_token(
        data={"sub": user.email, "id_usuario": user.id_usuario, "rol": user.id_rol}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id_usuario": user.id_usuario,
            "nombre": user.nombre,
            "email": user.email,
            "id_rol": user.id_rol,
            "telefono": user.telefono,
            "is_active": user.is_active
        }
    }

@router.post("/cambiar-contraseña", status_code=200)
def cambiar_contraseña(
    usuario_id: int = Body(...),
    nueva_contraseña: str = Body(...),
    db: Session = Depends(get_db)
):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db_usuario.contraseña = pwd_context.hash(nueva_contraseña)
    db.commit()
    return {"msg": "Contraseña actualizada correctamente"}

@router.post("/recuperar-contraseña", status_code=200)
async def recuperar_contraseña(
    email: str = Body(...),
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="No existe un usuario con ese email")

    # Genera un token de recuperación válido por 30 minutos
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    token_data = {
        "id_usuario": usuario.id_usuario,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    reset_url = f"{os.getenv('FRONTEND_URL')}/resetear-contraseña?token={token}"

    message = MessageSchema(
        subject="Recupera tu contraseña en NovaForgeGames",
        recipients=[usuario.email],
        body=f"Hola {usuario.nombre}, haz clic en el siguiente enlace para restablecer tu contraseña: {reset_url}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"msg": "Email de recuperación enviado"}

@router.post("/resetear-contraseña", status_code=200)
def resetear_contraseña(
    token: str = Body(...),
    nueva_contraseña: str = Body(...),
    db: Session = Depends(get_db)
):
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = data.get("id_usuario")
    except Exception:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.contraseña = nueva_contraseña  # En producción, hashea la contraseña
    db.commit()
    return {"msg": "Contraseña restablecida correctamente"}
