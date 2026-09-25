from database import get_db_connection

class ClienteModel:
    @staticmethod
    def find_by_telefone(telefone):
        # Limpa o telefone para busca flexível
        clean_tel = "".join([c for c in telefone if c.isdigit()])
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM clientes WHERE telefone = ? OR REPLACE(REPLACE(REPLACE(REPLACE(telefone, '(', ''), ')', ''), '-', ''), ' ', '') = ?", (telefone, clean_tel))
        cliente = cursor.fetchone()
        conn.close()
        return dict(cliente) if cliente else None

    @staticmethod
    def get_by_id(cliente_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM clientes WHERE id = ?", (cliente_id,))
        cliente = cursor.fetchone()
        conn.close()
        return dict(cliente) if cliente else None

    @staticmethod
    def create(nome, telefone, endereco=None, numero=None, complemento=None, bairro=None, cidade=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO clientes (nome, telefone, endereco, numero, complemento, bairro, cidade)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (nome.strip(), telefone.strip(), endereco, numero, complemento, bairro, cidade))
        cliente_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return ClienteModel.get_by_id(cliente_id)

    @staticmethod
    def update_endereco(cliente_id, endereco, numero, complemento, bairro, cidade):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE clientes 
            SET endereco = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (endereco, numero, complemento, bairro, cidade, cliente_id))
        conn.commit()
        conn.close()
        return ClienteModel.get_by_id(cliente_id)

    @staticmethod
    def list_all():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT c.*, 
                   COUNT(p.id) as total_pedidos,
                   COALESCE(MAX(p.created_at), '') as ultimo_pedido,
                   COALESCE(SUM(p.total), 0) as total_gasto
            FROM clientes c
            LEFT JOIN pedidos p ON c.id = p.cliente_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        ''')
        clientes = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return clientes
