from database import get_db_connection

class PedidoModel:
    STATUS_ENTREGA = ['NOVO', 'CONFIRMADO', 'EM PREPARO', 'PRONTO', 'SAIU PARA ENTREGA', 'ENTREGUE', 'CANCELADO']
    STATUS_RETIRADA = ['NOVO', 'CONFIRMADO', 'EM PREPARO', 'PRONTO PARA RETIRADA', 'RETIRADO', 'CANCELADO']

    @staticmethod
    def create(cliente_id, tipo_entrega, subtotal, taxa_entrega, total, observacao, endereco_entrega, itens):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO pedidos (cliente_id, tipo_entrega, status, subtotal, taxa_entrega, total, observacao, endereco_entrega)
            VALUES (?, ?, 'NOVO', ?, ?, ?, ?, ?)
        ''', (cliente_id, tipo_entrega, float(subtotal), float(taxa_entrega), float(total), observacao, endereco_entrega))
        pedido_id = cursor.lastrowid

        for item in itens:
            cursor.execute('''
                INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, subtotal)
                VALUES (?, ?, ?, ?, ?)
            ''', (pedido_id, item['produto_id'], int(item['quantidade']), float(item['preco_unitario']), float(item['subtotal'])))

        conn.commit()
        conn.close()
        return PedidoModel.get_by_id(pedido_id)

    @staticmethod
    def get_by_id(pedido_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT p.*, c.nome as cliente_nome, c.telefone as cliente_telefone
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE p.id = ?
        ''', (pedido_id,))
        pedido = cursor.fetchone()
        if not pedido:
            conn.close()
            return None

        pedido_dict = dict(pedido)
        cursor.execute('''
            SELECT pi.*, pr.nome as produto_nome, pr.imagem as produto_imagem
            FROM pedido_itens pi
            JOIN produtos pr ON pi.produto_id = pr.id
            WHERE pi.pedido_id = ?
        ''', (pedido_id,))
        pedido_dict['itens'] = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return pedido_dict

    @staticmethod
    def update_status(pedido_id, novo_status):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE pedidos
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (novo_status, pedido_id))
        conn.commit()
        conn.close()

    @staticmethod
    def list_all(filtro_status=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        query = '''
            SELECT p.*, c.nome as cliente_nome, c.telefone as cliente_telefone,
                   (SELECT COUNT(*) FROM pedido_itens WHERE pedido_id = p.id) as total_itens
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE 1=1
        '''
        params = []
        if filtro_status and filtro_status != 'TODOS':
            query += " AND p.status = ?"
            params.append(filtro_status)
        query += " ORDER BY p.id DESC"
        cursor.execute(query, params)
        pedidos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return pedidos

    @staticmethod
    def list_by_cliente(cliente_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT p.*, (SELECT COUNT(*) FROM pedido_itens WHERE pedido_id = p.id) as total_itens
            FROM pedidos p
            WHERE p.cliente_id = ?
            ORDER BY p.id DESC
        ''', (cliente_id,))
        pedidos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return pedidos

    @staticmethod
    def get_dashboard_metrics():
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Pedidos hoje
        cursor.execute('''
            SELECT COUNT(*) as pedidos_hoje, COALESCE(SUM(total), 0) as faturamento_hoje
            FROM pedidos
            WHERE DATE(created_at) = DATE('now', 'localtime') AND status != 'CANCELADO'
        ''')
        hoje = cursor.fetchone()
        
        # Em preparo
        cursor.execute("SELECT COUNT(*) as count FROM pedidos WHERE status IN ('EM PREPARO', 'CONFIRMADO')")
        em_preparo = cursor.fetchone()['count']

        # Aguardando atendimento / Novos
        cursor.execute("SELECT COUNT(*) as count FROM pedidos WHERE status = 'NOVO'")
        aguardando = cursor.fetchone()['count']

        # Total geral
        cursor.execute("SELECT COUNT(*) as total_pedidos, COALESCE(SUM(total), 0) as faturamento_total FROM pedidos WHERE status != 'CANCELADO'")
        total = cursor.fetchone()

        conn.close()
        return {
            'pedidos_hoje': hoje['pedidos_hoje'],
            'faturamento_hoje': hoje['faturamento_hoje'],
            'em_preparo': em_preparo,
            'aguardando': aguardando,
            'total_pedidos': total['total_pedidos'],
            'faturamento_total': total['faturamento_total']
        }
