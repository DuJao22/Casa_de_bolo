from database import get_db_connection

class Avaliacao:
    @staticmethod
    def criar(produto_id, pedido_id, cliente_id, nota, comentario, status='aprovada'):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO avaliacoes (produto_id, pedido_id, cliente_id, nota, comentario, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (produto_id, pedido_id, cliente_id, nota, comentario, status))
        conn.commit()
        avaliacao_id = cursor.lastrowid
        conn.close()
        return avaliacao_id

    @staticmethod
    def listar_por_produto(produto_id, apenas_aprovadas=True):
        conn = get_db_connection()
        cursor = conn.cursor()
        if apenas_aprovadas:
            cursor.execute('''
                SELECT a.*, c.nome as cliente_nome
                FROM avaliacoes a
                JOIN clientes c ON a.cliente_id = c.id
                WHERE a.produto_id = ? AND a.status = 'aprovada'
                ORDER BY a.created_at DESC
            ''', (produto_id,))
        else:
            cursor.execute('''
                SELECT a.*, c.nome as cliente_nome
                FROM avaliacoes a
                JOIN clientes c ON a.cliente_id = c.id
                WHERE a.produto_id = ?
                ORDER BY a.created_at DESC
            ''', (produto_id,))
        rows = cursor.fetchall()
        conn.close()
        return rows

    @staticmethod
    def obter_media_produto(produto_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT AVG(nota) as media, COUNT(*) as total
            FROM avaliacoes
            WHERE produto_id = ? AND status = 'aprovada'
        ''', (produto_id,))
        row = cursor.fetchone()
        conn.close()
        return {
            'media': round(row['media'], 1) if row['media'] else 0.0,
            'total': row['total'] if row['total'] else 0
        }

    @staticmethod
    def listar_todas(filtro_status=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        if filtro_status and filtro_status != 'TODAS':
            cursor.execute('''
                SELECT a.*, p.nome as produto_nome, c.nome as cliente_nome
                FROM avaliacoes a
                JOIN produtos p ON a.produto_id = p.id
                JOIN clientes c ON a.cliente_id = c.id
                WHERE a.status = ?
                ORDER BY a.created_at DESC
            ''', (filtro_status,))
        else:
            cursor.execute('''
                SELECT a.*, p.nome as produto_nome, c.nome as cliente_nome
                FROM avaliacoes a
                JOIN produtos p ON a.produto_id = p.id
                JOIN clientes c ON a.cliente_id = c.id
                ORDER BY a.created_at DESC
            ''')
        rows = cursor.fetchall()
        conn.close()
        return rows

    @staticmethod
    def moderar(avaliacao_id, novo_status):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE avaliacoes SET status = ? WHERE id = ?', (novo_status, avaliacao_id))
        conn.commit()
        conn.close()

    @staticmethod
    def responder(avaliacao_id, resposta_admin):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE avaliacoes SET resposta_admin = ? WHERE id = ?', (resposta_admin, avaliacao_id))
        conn.commit()
        conn.close()
