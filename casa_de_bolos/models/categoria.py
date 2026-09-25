from database import get_db_connection

class CategoriaModel:
    @staticmethod
    def list_all(somente_ativas=False):
        conn = get_db_connection()
        cursor = conn.cursor()
        if somente_ativas:
            cursor.execute("SELECT * FROM categorias WHERE ativo = 1 ORDER BY ordem ASC, nome ASC")
        else:
            cursor.execute("SELECT * FROM categorias ORDER BY ordem ASC, nome ASC")
        categorias = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return categorias

    @staticmethod
    def get_by_id(categoria_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categorias WHERE id = ?", (categoria_id,))
        categoria = cursor.fetchone()
        conn.close()
        return dict(categoria) if categoria else None

    @staticmethod
    def create(nome, descricao, ativo=1, ordem=0):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO categorias (nome, descricao, ativo, ordem)
            VALUES (?, ?, ?, ?)
        ''', (nome.strip(), descricao.strip() if descricao else '', int(ativo), int(ordem)))
        categoria_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return CategoriaModel.get_by_id(categoria_id)

    @staticmethod
    def update(categoria_id, nome, descricao, ativo, ordem):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE categorias
            SET nome = ?, descricao = ?, ativo = ?, ordem = ?
            WHERE id = ?
        ''', (nome.strip(), descricao.strip() if descricao else '', int(ativo), int(ordem), categoria_id))
        conn.commit()
        conn.close()
        return CategoriaModel.get_by_id(categoria_id)

    @staticmethod
    def toggle_ativo(categoria_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE categorias SET ativo = CASE WHEN ativo = 1 THEN 0 ELSE 1 END WHERE id = ?", (categoria_id,))
        conn.commit()
        conn.close()
