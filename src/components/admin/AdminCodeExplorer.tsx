import React, { useState } from 'react';
import { Copy, Check, FileCode, Folder, Terminal } from 'lucide-react';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  lang?: string;
}

export const AdminCodeExplorer: React.FC = () => {
  const [copiado, setCopiado] = useState(false);
  const [arquivoAtivo, setArquivoAtivo] = useState<string>('casa_de_bolos/app.py');

  const filesMap: Record<string, { name: string; lang: string; content: string }> = {
    'casa_de_bolos/app.py': {
      name: 'app.py',
      lang: 'python',
      content: `import os
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

    # Filtro Jinja para formatação de moeda brasileira (R$ 39,90)
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)`
    },
    'casa_de_bolos/database.py': {
      name: 'database.py',
      lang: 'python',
      content: `import sqlite3
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

    # Tabela clientes
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

    # Tabela categorias
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            ativo INTEGER DEFAULT 1,
            ordem INTEGER DEFAULT 0
        )
    ''')

    # Tabela produtos
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

    # Tabela pedidos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            tipo_entrega TEXT NOT NULL,
            status TEXT NOT NULL,
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

    # Tabela pedido_itens
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

    # Tabela configuracoes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS configuracoes (
            chave TEXT PRIMARY KEY,
            valor TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()`
    },
    'casa_de_bolos/models/pedido.py': {
      name: 'models/pedido.py',
      lang: 'python',
      content: `from database import get_db_connection

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
        return PedidoModel.get_by_id(pedido_id)`
    },
    'casa_de_bolos/routes/cliente.py': {
      name: 'routes/cliente.py',
      lang: 'python',
      content: `from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from services.cliente_service import ClienteService

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/')
def index():
    return render_template('index.html')

@cliente_bp.route('/identificacao', methods=['GET', 'POST'])
def identificacao():
    if request.method == 'POST':
        telefone = request.form.get('telefone', '').strip()
        cliente = ClienteService.identificar_por_telefone(telefone)
        if cliente:
            session['cliente_id'] = cliente['id']
            session['cliente_nome'] = cliente['nome']
            flash(f"Olá, {cliente['nome']}! Que bom ter você de volta.", 'success')
            return redirect(url_for('catalogo.listar'))
        else:
            flash('Parece que é seu primeiro pedido por aqui. Vamos fazer seu cadastro rapidinho.', 'info')
            return redirect(url_for('cliente.cadastro', telefone=telefone))
    return render_template('identificacao.html')`
    },
    'casa_de_bolos/requirements.txt': {
      name: 'requirements.txt',
      lang: 'text',
      content: `Flask==3.0.3
Werkzeug==3.0.3
Jinja2==3.1.4`
    },
    'casa_de_bolos/README.md': {
      name: 'README.md',
      lang: 'markdown',
      content: `# Casa de Bolos — Plataforma de Atendimento & Pedidos Online (V1)

## 🚀 Como Executar Localmente
\`\`\`bash
cd casa_de_bolos
pip install -r requirements.txt
python app.py
\`\`\`

Acesse:
- Loja / Cliente: http://localhost:5000/
- Painel Administrativo: http://localhost:5000/admin`
    }
  };

  const arquivo = filesMap[arquivoAtivo] || filesMap['casa_de_bolos/app.py'];

  const handleCopiar = () => {
    navigator.clipboard.writeText(arquivo.content);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Código Python 3 / Flask / SQLite3 (V1)
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
            Todos os arquivos da arquitetura solicitada prontos para execução local.
          </p>
        </div>

        <button
          onClick={handleCopiar}
          className="px-3.5 py-2 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 self-start sm:self-auto"
        >
          {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiado ? 'Copiado!' : 'Copiar Código do Arquivo'}</span>
        </button>
      </div>

      {/* Comandos Rápidos */}
      <div className="bg-[#2D241E] text-white rounded-xl p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Comandos para iniciar no terminal:</span>
          <span className="text-amber-200">pip install -r requirements.txt && python app.py</span>
        </div>
        <span className="text-[11px] text-[#E8D8C8]/70">Porta local: :5000</span>
      </div>

      {/* Grid: Árvore de Arquivos e Visualizador */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        
        {/* Coluna da Esquerda: Arquivos */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#E8E2D9] p-3 space-y-1 bg-[#FAF7F2]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#7E7267] px-2 py-1 block">
            Arquivos do Projeto Python
          </span>
          {Object.keys(filesMap).map(caminho => (
            <button
              key={caminho}
              onClick={() => setArquivoAtivo(caminho)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                arquivoAtivo === caminho
                  ? 'bg-[#8C482A] text-white font-bold'
                  : 'text-[#2D241E] hover:bg-[#FAF0E6]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span className="truncate">{caminho.replace('casa_de_bolos/', '')}</span>
            </button>
          ))}
        </div>

        {/* Coluna da Direita: Conteúdo do Arquivo */}
        <div className="md:col-span-8 flex flex-col h-[520px]">
          <div className="p-3 bg-[#FAF7F2] border-b border-[#E8E2D9] flex items-center justify-between text-xs font-mono text-[#7E7267]">
            <span>{arquivoAtivo}</span>
            <span>{arquivo.lang.toUpperCase()}</span>
          </div>
          <pre className="p-4 flex-1 overflow-auto font-mono text-xs text-[#2D241E] bg-[#FFFFFF] leading-relaxed selection:bg-[#E8D8C8]">
            <code>{arquivo.content}</code>
          </pre>
        </div>

      </div>

    </div>
  );
};
