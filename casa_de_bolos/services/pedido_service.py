from models.pedido import PedidoModel
from database import get_db_connection

class PedidoService:
    @staticmethod
    def get_taxa_entrega():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT valor FROM configuracoes WHERE chave = 'taxa_entrega'")
        row = cursor.fetchone()
        conn.close()
        return float(row['valor']) if row else 7.50

    @staticmethod
    def set_taxa_entrega(valor):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('taxa_entrega', ?)", (str(float(valor)),))
        conn.commit()
        conn.close()

    @staticmethod
    def criar_pedido(cliente_id, tipo_entrega, itens, observacao="", endereco_entrega=""):
        if not itens:
            raise ValueError("O carrinho não pode estar vazio.")
        
        subtotal = sum(item['subtotal'] for item in itens)
        taxa = PedidoService.get_taxa_entrega() if tipo_entrega == 'entrega' else 0.0
        total = subtotal + taxa

        pedido = PedidoModel.create(
            cliente_id=cliente_id,
            tipo_entrega=tipo_entrega,
            subtotal=subtotal,
            taxa_entrega=taxa,
            total=total,
            observacao=observacao,
            endereco_entrega=endereco_entrega,
            itens=itens
        )
        return pedido

    @staticmethod
    def obter_pedido(pedido_id):
        return PedidoModel.get_by_id(pedido_id)

    @staticmethod
    def atualizar_status(pedido_id, novo_status):
        PedidoModel.update_status(pedido_id, novo_status)

    @staticmethod
    def listar_pedidos(status=None):
        return PedidoModel.list_all(status)

    @staticmethod
    def obter_metricas_dashboard():
        return PedidoModel.get_dashboard_metrics()
