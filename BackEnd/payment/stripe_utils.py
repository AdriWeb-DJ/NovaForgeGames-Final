import stripe
import os
from dotenv import load_dotenv
from fastapi import HTTPException, status

load_dotenv()

# Configuración de Stripe
stripe.api_key = os.getenv("STRIPE_API_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# Crear una intención de pago
def create_payment_intent(amount: float, currency: str = "eur", metadata=None):
    try:
        # Convertir a centavos para Stripe
        amount_cents = int(amount * 100)
        
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            metadata=metadata,
            automatic_payment_methods={"enabled": True},
        )
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la intención de pago: {str(e)}"
        )

# Verificar el estado de un pago
def check_payment_status(payment_intent_id: str):
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        return {
            "status": intent.status,
            "amount": intent.amount / 100,  # Convertir de centavos a la moneda base
            "currency": intent.currency,
            "metadata": intent.metadata
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al verificar el estado del pago: {str(e)}"
        )

# Procesar un webhook de Stripe
def process_webhook(payload, sig_header):
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        
        # Manejar diferentes tipos de eventos
        if event.type == 'payment_intent.succeeded':
            payment_intent = event.data.object
            # Aquí puedes actualizar el estado de la compra en tu base de datos
            return {"status": "success", "payment_intent_id": payment_intent.id}
        
        elif event.type == 'payment_intent.payment_failed':
            payment_intent = event.data.object
            # Aquí puedes manejar el fallo del pago
            return {"status": "failed", "payment_intent_id": payment_intent.id}
        
        return {"status": "received", "type": event.type}
    
    except stripe.error.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firma de webhook inválida"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al procesar el webhook: {str(e)}"
        )


# Renombrar funciones

# Crear un producto en Stripe
def crear_producto_stripe(nombre: str, descripcion: str = None, imagenes: list = None):
    try:
        producto = stripe.Product.create(
            name=nombre,
            description=descripcion,
            images=imagenes if imagenes else []
        )
        return producto
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el producto en Stripe: {str(e)}"
        )

# Crear un precio para un producto en Stripe
def crear_precio_stripe(id_producto: str, precio_unitario: float, moneda: str = "eur"):
    try:
        # Convertir a centavos para Stripe
        precio_centavos = int(precio_unitario * 100)
        
        precio = stripe.Price.create(
            product=id_producto,
            unit_amount=precio_centavos,
            currency=moneda,
        )
        return precio
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear el precio en Stripe: {str(e)}"
        )

# Crear un checkout session para pago
def crear_sesion_pago(items_linea, url_exito, url_cancelacion, metadatos=None):
    try:
        sesion_pago = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=items_linea,
            mode="payment",
            success_url=url_exito,
            cancel_url=url_cancelacion,
            metadata=metadatos
        )
        return sesion_pago
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la sesión de checkout: {str(e)}"
        )