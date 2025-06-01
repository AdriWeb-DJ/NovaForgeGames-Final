from database import engine, Base
from models import Usuario, Rol, Producto, Categoria, Proveedor, Compra, DetalleCompra

def init_db():
    # Crear todas las tablas en la base de datos
    Base.metadata.create_all(bind=engine)
    print("Base de datos inicializada correctamente.")

if __name__ == "__main__":
    init_db()