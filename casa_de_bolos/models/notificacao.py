from database import get_db_connection

class Notificacao:
    @staticmethod
    def criar(tipo, destinatario, titulo, mensagem, pedido_id=None, cliente_id=None, whatsapp_texto=None, sms_texto=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO notificacoes (tipo, destinatario, titulo, mensagem, pedido_id, cliente_id, whatsapp_texto, sms_texto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (tipo, destinatario, titulo, mensagem, pedido_id, cliente_id, whatsapp_texto, sms_texto))
        conn.commit()
        notif_id = cursor.lastrowid
        conn.close()
        return notif_id

    @staticmethod
    def listar(destinatario=None, limite=50):
        conn = get_db_connection()
        cursor = conn.cursor()
        if destinatario:
            cursor.execute('''
                SELECT * FROM notificacoes 
                WHERE destinatario = ? OR destinatario = 'ambos'
                ORDER BY created_at DESC LIMIT ?
            ''', (destinatario, limite))
        else:
            cursor.execute('SELECT * FROM notificacoes ORDER BY created_at DESC LIMIT ?', (limite,))
        rows = cursor.fetchall()
        conn.close()
        return rows

    @staticmethod
    def marcar_como_lida(notificacao_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE notificacoes SET lida = 1 WHERE id = ?', (notificacao_id,))
        conn.commit()
        conn.close()
