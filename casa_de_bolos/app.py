import os
from flask import Flask, redirect, url_for
from config import Config
from database import init_db
from routes.cliente import cliente_bp
from routes.catalogo import catalogo_bp
from routes.pedido import pedido_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar banco de dados SQLite3
    with app.app_context():
        init_db()

    # Registrar Blueprints
    app.register_blueprint(cliente_bp)
    app.register_blueprint(catalogo_bp)
    app.register_blueprint(pedido_bp)
    app.register_blueprint(admin_bp)

    # Filtro Jinja para formatação de moeda brasileira
    @app.template_filter('moeda')
    def formatar_moeda(valor):
        try:
            return f"R$ {float(valor):,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        except (ValueError, TypeError):
            return "R$ 0,00"

    # Contexto global para templates (dados da loja)
    @app.context_processor
    def inject_global_data():
        from services.pedido_service import PedidoService
        return {
            'loja_nome': Config.STORE_NAME,
            'loja_telefone': Config.STORE_PHONE,
            'loja_endereco': Config.STORE_ADDRESS,
            'taxa_entrega_padrao': PedidoService.get_taxa_entrega()
        }

    return app

app = create_app()

if __name__ == '__main__':
    # Porta padrão para desenvolvimento local
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
