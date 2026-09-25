import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'casa-de-bolos-secret-key-2026-v1')
    DATABASE = os.path.join(BASE_DIR, 'database', 'casa_de_bolos.db')
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    DEFAULT_DELIVERY_FEE = 7.50
    STORE_NAME = "Casa de Bolos"
    STORE_PHONE = "(11) 98765-4321"
    STORE_ADDRESS = "Rua das Confeitarias, 120 - Centro, São Paulo - SP"
