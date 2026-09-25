from database import get_db_connection

class ProdutoModel:
    @staticmethod
    def list_all(somente_ativos=False, categoria_id=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        query = '''
            SELECT p.*, c.nome as categoria_nome 
            FROM produtos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE 1=1
        '''
        params = []
        if somente_ativos:
            query += " AND p.ativo = 1 AND c.ativo = 1"
        if categoria_id:
            query += " AND p.categoria_id = ?"
            params.append(categoria_id)
        
        query += " ORDER BY p.destaque DESC, p.nome ASC"
        cursor.execute(query, params)
        produtos = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return produtos

    @staticmethod
    def get_by_id(produto_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT p.*, c.nome as categoria_nome 
            FROM produtos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ?
        ''', (produto_id,))
        produto = cursor.fetchone()
        conn.close()
        return dict(produto) if produto else None

    @staticmethod
    def create(categoria_id, nome, descricao, preco, imagem, ativo=1, destaque=0):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO produtos (categoria_id, nome, descricao, preco, imagem, ativo, destaque)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (categoria_id, nome.strip(), descricao.strip() if descricao else '', float(preco), imagem, int(ativo), int(destaque)))
        produto_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return ProdutoModel.get_by_id(produto_id)

    @staticmethod
    def update(produto_id, categoria_id, nome, descricao, preco, imagem=None, ativo=1, destaque=0):
        conn = get_db_connection()
        cursor = conn.cursor()
        if imagem:
            cursor.execute('''
                UPDATE produtos
                SET categoria_id = ?, nome = ?, descricao = ?, preco = ?, imagem = ?, ativo = ?, destaque = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (categoria_id, nome.strip(), descricao.strip() if descricao else '', float(preco), imagem, int(ativo), int(destaque), produto_id))
        else:
            cursor.execute('''
                UPDATE produtos
                SET categoria_id = ?, nome = ?, descricao = ?, preco = ?, ativo = ?, destaque = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (categoria_id, nome.strip(), descricao.strip() if descricao else '', float(preco), int(ativo), int(destaque), produto_id))
        conn.commit()
        conn.close()
        return ProdutoModel.get_by_id(produto_id)

    @staticmethod
    def toggle_ativo(produto_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE produtos SET ativo = CASE WHEN ativo = 1 THEN 0 ELSE 1 END WHERE id = ?", (produto_id,))
        conn.commit()
        conn.close()

    @staticmethod
    def has_orders(produto_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM pedido_itens WHERE produto_id = ?", (produto_id,))
        count = cursor.fetchone()['count']
        conn.close()
        return count > 0

    @staticmethod
    def delete_or_deactivate(produto_id):
        # Conforme especificação: "Não apagar fisicamente produtos que já estejam vinculados a pedidos. Preferir desativação."
        if ProdutoModel.has_orders(produto_id):
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE produtos SET ativo = 0 WHERE id = ?", (produto_id,))
            conn.commit()
            conn.close()
            return "deactivated"
        else:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM produtos WHERE id = ?", (produto_id,))
            conn.commit()
            conn.close()
            return "deleted"
