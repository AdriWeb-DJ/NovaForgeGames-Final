from fastapi import FastAPI, Depends, HTTPException, status, Request, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import os
from typing import List
import logging

from database import get_db, engine, Base, SessionLocal
import models
import schemas
from auth.jwt import authenticate_user, create_access_token, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES
from payment.stripe_utils import create_payment_intent, check_payment_status, process_webhook, crear_sesion_pago  # Nombre actualizado

# Importar todos los routers
from routers import usuarios, roles, categorias, proveedores, productos, compras, detalles_compra

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NovaForgeGames API", description="API para la tienda en línea de NovaForgeGames")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para autenticación y obtención de token JWT
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Aquí asumimos que el frontend envía la contraseña ya hasheada
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint para obtener información del usuario currente
@app.get("/users/me", response_model=schemas.Usuario)
async def read_users_me(current_user: schemas.Usuario = Depends(get_current_active_user)):
    return current_user

# Endpoints para Stripe con nombres en español
@app.post("/crear-intencion-pago")
async def crear_intencion_pago(monto: float, current_user: schemas.Usuario = Depends(get_current_active_user)):
    return create_payment_intent(monto, metadata={"user_id": current_user.id_usuario})

@app.get("/estado-pago/{payment_intent_id}")
async def estado_pago(payment_intent_id: str, current_user: schemas.Usuario = Depends(get_current_active_user)):
    return check_payment_status(payment_intent_id)

@app.post("/webhook")
async def webhook_stripe(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    event = process_webhook(payload, sig_header)

    print(f"Evento recibido: {event['type']}")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"].get("user_id")

        import stripe
        stripe.api_key = os.getenv("STRIPE_API_KEY")
        items = stripe.checkout.Session.list_line_items(session["id"], limit=100)

        total = sum([item.amount_total / 100 for item in items.data])

        db = SessionLocal()
        try:
            # Crea la compra
            db_compra = models.Compra(
                id_usuario=user_id,
                total=total
            )
            db.add(db_compra)
            db.commit()
            db.refresh(db_compra)

            # Crea los detalles de la compra y actualiza stock
            for item in items.data:
                db_producto = db.query(models.Producto).filter(models.Producto.id_precio_stripe == item.price.id).first()
                if db_producto:
                    detalle = models.DetalleCompra(
                        id_compra=db_compra.id_compra,
                        id_producto=db_producto.id_producto,
                        cantidad=item.quantity,
                        precio_unitario=db_producto.precio
                    )
                    db_producto.cantidad = db_producto.cantidad - item.quantity
                    db.add(detalle)
                else:
                    logging.error(f"Producto con id_precio_stripe {item.price.id} no encontrado.")
            db.commit()
            print(f"Compra y detalles guardados para usuario {user_id}")
        except Exception as e:
            db.rollback()
            logging.error(f"Error guardando compra Stripe: {e}")
            print(f"Error guardando compra Stripe: {e}")
        finally:
            db.close()

    return {"status": "success"}

# Nuevos endpoints para la pasarela de pago
@app.post("/crear-sesion-pago")
async def crear_sesion_checkout(
    items: List[dict] = Body(...),
    current_user: schemas.Usuario = Depends(get_current_active_user)
):
    db = next(get_db())
    items_linea = []
    total = 0
    detalles = []

    # 1. Verifica stock y prepara detalles
    for item in items:
        db_producto = db.query(models.Producto).filter(models.Producto.id_producto == item["id_producto"]).first()
        if not db_producto:
            raise HTTPException(status_code=404, detail=f"Producto con ID {item['id_producto']} no encontrado")
        if db_producto.cantidad < item["cantidad"]:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para {db_producto.nombre}")

        items_linea.append({
            "price": db_producto.id_precio_stripe,
            "quantity": item["cantidad"]
        })
        total += db_producto.precio * item["cantidad"]
        detalles.append({
            "id_producto": db_producto.id_producto,
            "cantidad": item["cantidad"],
            "precio_unitario": db_producto.precio
        })

    # 2. Crea la compra en la base de datos (estado "pendiente")
    db_compra = models.Compra(
        id_usuario=current_user.id_usuario,
        total=total
        # estado="pendiente"  # <-- Elimina o comenta esta línea
    )
    db.add(db_compra)
    db.commit()
    db.refresh(db_compra)

    # 3. Crea los detalles de la compra
    for det in detalles:
        detalle = models.DetalleCompra(
            id_compra=db_compra.id_compra,
            id_producto=det["id_producto"],
            cantidad=det["cantidad"],
            precio_unitario=det["precio_unitario"]
        )
        db.add(detalle)
    db.commit()

    # 4. URLs de redirección
    url_exito = os.getenv("FRONTEND_URL", "http://localhost:5173") + "/pagar/exito"
    url_cancelacion = os.getenv("FRONTEND_URL", "http://localhost:5173") + "/pagar/fallo"

    # 5. Crea la sesión de Stripe con el id_compra en metadatos
    sesion_checkout = crear_sesion_pago(
        items_linea=items_linea,
        url_exito=url_exito,
        url_cancelacion=url_cancelacion,
        metadatos={
            "user_id": current_user.id_usuario,
            "id_compra": db_compra.id_compra
        }
    )

    return {"url_pago": sesion_checkout.url}

# Incluir todos los routers
app.include_router(usuarios.router)
app.include_router(roles.router)
app.include_router(categorias.router)
app.include_router(proveedores.router)
app.include_router(productos.router)
app.include_router(compras.router)
app.include_router(detalles_compra.router)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de NovaForgeGames"}