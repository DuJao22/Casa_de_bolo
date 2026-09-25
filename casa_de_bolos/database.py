import sqlite3
import os
from config import Config

def get_db_connection():
    os.makedirs(os.path.dirname(Config.DATABASE), exist_ok=True)
    conn = sqlite3.connect(Config.DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table: clientes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT UNIQUE NOT NULL,
            endereco TEXT,
            numero TEXT,
            complemento TEXT,
            bairro TEXT,
            cidade TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Table: categorias
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            ativo INTEGER DEFAULT 1,
            ordem INTEGER DEFAULT 0
        )
    ''')

    # Table: produtos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            imagem TEXT,
            ativo INTEGER DEFAULT 1,
            destaque INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        )
    ''')

    # Table: pedidos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            tipo_entrega TEXT NOT NULL, -- 'retirada' ou 'entrega'
            status TEXT NOT NULL,       -- 'NOVO', 'CONFIRMADO', 'EM PREPARO', etc.
            subtotal REAL NOT NULL,
            taxa_entrega REAL DEFAULT 0.0,
            total REAL NOT NULL,
            observacao TEXT,
            endereco_entrega TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
    ''')

    # Table: pedido_itens
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedido_itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            preco_unitario REAL NOT NULL,
            subtotal REAL NOT NULL,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        )
    ''')

    # Table: configuracoes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS configuracoes (
            chave TEXT PRIMARY KEY,
            valor TEXT NOT NULL
        )
    ''')

    # Table: avaliacoes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS avaliacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL,
            pedido_id INTEGER NOT NULL,
            cliente_id INTEGER NOT NULL,
            nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
            comentario TEXT NOT NULL,
            status TEXT DEFAULT 'aprovada', -- 'aprovada', 'pendente', 'rejeitada'
            resposta_admin TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (produto_id) REFERENCES produtos(id),
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
    ''')

    # Table: notificacoes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notificacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,         -- 'status_pedido', 'nova_avaliacao', 'sistema'
            destinatario TEXT NOT NULL, -- 'cliente', 'admin', 'ambos'
            titulo TEXT NOT NULL,
            mensagem TEXT NOT NULL,
            pedido_id INTEGER,
            cliente_id INTEGER,
            lida INTEGER DEFAULT 0,
            whatsapp_texto TEXT,
            sms_texto TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
    ''')

    # Seed Default Settings
    cursor.execute("INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('taxa_entrega', '7.50')")
    cursor.execute("INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('nome_loja', 'Casa de Bolos')")
    cursor.execute("INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('telefone_loja', '(11) 98765-4321')")
    cursor.execute("INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('endereco_loja', 'Rua das Confeitarias, 120 - Centro')")

    # Seed Categories if empty
    cursor.execute("SELECT COUNT(*) as count FROM categorias")
    if cursor.fetchone()['count'] == 0:
        categorias_iniciais = [
            ("Bolos Caseiros", "Receitas tradicionais fofinhas para acompanhar o café", 1, 1),
            ("Bolos de Chocolate", "Massa fofinha com coberturas generosas de chocolate", 1, 2),
            ("Bolos Recheados", "Camadas macias com recheios nobres e artesanais", 1, 3),
            ("Doces & Fatias", "Docinhos, brigadeiros e porções individuais", 1, 4),
            ("Combos Especiais", "Combos de bolo + docinhos para comemorações", 1, 5)
        ]
        cursor.executemany("INSERT INTO categorias (nome, descricao, ativo, ordem) VALUES (?, ?, ?, ?)", categorias_iniciais)

    # Seed Products if empty
    cursor.execute("SELECT COUNT(*) as count FROM produtos")
    if cursor.fetchone()['count'] == 0:
        produtos_iniciais = [
            (2, "Bolo de Chocolate Vulcão", "Massa artesanal de cacau 50% com cobertura vulcão de brigadeiro belga cremoso e raspas.", 42.00, "/static/uploads/bolo_chocolate.jpg", 1, 1),
            (1, "Bolo de Cenoura com Brigadeiro", "O clássico brasileiro: massa leve de cenoura fresca com calda aveludada de chocolate.", 38.00, "/static/uploads/bolo_cenoura.jpg", 1, 1),
            (3, "Bolo Red Velvet com Frutas Vermelhas", "Massa aveludada, recheio de cream cheese suave e frutas vermelhas frescas selecionadas.", 54.00, "/static/uploads/bolo_red_velvet.jpg", 1, 1),
            (1, "Bolo de Fubá com Goiabada", "Receita de família com massa de milho macia e pedaços derretidos de goiabada cascão.", 32.00, "/static/uploads/bolo_fuba.jpg", 1, 0),
            (2, "Bolo Prestígio Cremoso", "Massa de chocolate intenso com recheio cremoso de coco fresco ralado e ganache.", 46.00, "/static/uploads/bolo_prestigio.jpg", 1, 0),
            (4, "Caixa de Brigadeiros Gourmet (6 un)", "Sortidos: Tradicional Belga, Ninho com Nutella e Pistache artesanal.", 24.00, "/static/uploads/doces_caixa.jpg", 1, 1),
            (5, "Combo Café da Tarde Especial", "1 Bolo Caseiro à escolha + 4 fatias especiais + 1 pacote de café moído na hora 250g.", 69.90, "/static/uploads/combo_cafe.jpg", 1, 1)
        ]
        cursor.executemany("INSERT INTO produtos (categoria_id, nome, descricao, preco, imagem, ativo, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)", produtos_iniciais)

    # Seed initial client if empty
    cursor.execute("SELECT COUNT(*) as count FROM clientes")
    if cursor.fetchone()['count'] == 0:
        cursor.execute('''
            INSERT INTO clientes (id, nome, telefone, endereco, numero, bairro, cidade)
            VALUES (1, 'João da Silva', '(11) 98765-1111', 'Rua das Flores', '450', 'Jardins', 'São Paulo')
        ''')

    # Seed initial order if empty
    cursor.execute("SELECT COUNT(*) as count FROM pedidos")
    if cursor.fetchone()['count'] == 0:
        cursor.execute('''
            INSERT INTO pedidos (id, cliente_id, tipo_entrega, status, subtotal, taxa_entrega, total, endereco_entrega)
            VALUES (1, 1, 'entrega', 'ENTREGUE', 42.00, 7.50, 49.50, 'Rua das Flores, 450 - Jardins')
        ''')

    # Seed Initial Reviews if empty
    cursor.execute("SELECT COUNT(*) as count FROM avaliacoes")
    if cursor.fetchone()['count'] == 0:
        cursor.execute("SELECT id FROM produtos LIMIT 1")
        prod = cursor.fetchone()
        if prod:
            cursor.execute('''
                INSERT INTO avaliacoes (produto_id, pedido_id, cliente_id, nota, comentario, status, resposta_admin)
                VALUES (?, 1, 1, 5, 'Simplesmente divino! Massa macia e brigadeiro no ponto.', 'aprovada', 'Muito obrigado pelo carinho!')
            ''', (prod['id'],))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Banco de dados SQLite inicializado com sucesso!")
