from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from services.pedido_service import PedidoService
from services.produto_service import ProdutoService
from services.cliente_service import ClienteService
from models.categoria import CategoriaModel
from models.pedido import PedidoModel
from database import get_db_connection

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/')
def dashboard():
    metricas = PedidoService.obter_metricas_dashboard()
    pedidos_recentes = PedidoService.listar_pedidos()[:8]
    return render_template('admin/dashboard.html', metricas=metricas, pedidos=pedidos_recentes)

# ----------------- PEDIDOS -----------------
@admin_bp.route('/pedidos')
def pedidos():
    status_filtro = request.args.get('status', 'TODOS')
    lista_pedidos = PedidoService.listar_pedidos(status_filtro if status_filtro != 'TODOS' else None)
    return render_template('admin/pedidos.html', pedidos=lista_pedidos, status_atual=status_filtro)

@admin_bp.route('/pedidos/<int:pedido_id>')
def pedido_detalhe(pedido_id):
    pedido = PedidoService.obter_pedido(pedido_id)
    if not pedido:
        flash('Pedido não encontrado.', 'warning')
        return redirect(url_for('admin.pedidos'))
    
    status_opcoes = PedidoModel.STATUS_ENTREGA if pedido['tipo_entrega'] == 'entrega' else PedidoModel.STATUS_RETIRADA
    return render_template('admin/pedido.html', pedido=pedido, status_opcoes=status_opcoes)

@admin_bp.route('/pedidos/<int:pedido_id>/status', methods=['POST'])
def atualizar_status(pedido_id):
    novo_status = request.form.get('status')
    if novo_status:
        PedidoService.atualizar_status(pedido_id, novo_status)
        flash(f'Status do pedido #{pedido_id} alterado para: {novo_status}', 'success')
    return redirect(url_for('admin.pedido_detalhe', pedido_id=pedido_id))

# ----------------- PRODUTOS -----------------
@admin_bp.route('/produtos')
def produtos():
    lista_produtos = ProdutoService.listar_todos_admin()
    return render_template('admin/produtos.html', produtos=lista_produtos)

@admin_bp.route('/produtos/novo', methods=['GET', 'POST'])
def produto_novo():
    categorias = CategoriaModel.list_all(somente_ativas=False)
    if request.method == 'POST':
        nome = request.form.get('nome')
        categoria_id = request.form.get('categoria_id', type=int)
        preco = request.form.get('preco', type=float)
        descricao = request.form.get('descricao', '')
        imagem = request.form.get('imagem', '/static/uploads/bolo_placeholder.jpg')
        ativo = 1 if request.form.get('ativo') else 0
        destaque = 1 if request.form.get('destaque') else 0

        try:
            ProdutoService.salvar_produto(categoria_id, nome, descricao, preco, imagem, ativo, destaque)
            flash('Produto cadastrado com sucesso!', 'success')
            return redirect(url_for('admin.produtos'))
        except Exception as e:
            flash(f'Erro ao salvar: {str(e)}', 'danger')

    return render_template('admin/produto_form.html', produto=None, categorias=categorias)

@admin_bp.route('/produtos/<int:produto_id>/editar', methods=['GET', 'POST'])
def produto_editar(produto_id):
    produto = ProdutoService.obter_produto(produto_id)
    if not produto:
        flash('Produto não encontrado.', 'warning')
        return redirect(url_for('admin.produtos'))
    
    categorias = CategoriaModel.list_all(somente_ativas=False)
    if request.method == 'POST':
        nome = request.form.get('nome')
        categoria_id = request.form.get('categoria_id', type=int)
        preco = request.form.get('preco', type=float)
        descricao = request.form.get('descricao', '')
        imagem = request.form.get('imagem') or produto['imagem']
        ativo = 1 if request.form.get('ativo') else 0
        destaque = 1 if request.form.get('destaque') else 0

        try:
            ProdutoService.salvar_produto(categoria_id, nome, descricao, preco, imagem, ativo, destaque, produto_id=produto_id)
            flash('Produto atualizado com sucesso!', 'success')
            return redirect(url_for('admin.produtos'))
        except Exception as e:
            flash(f'Erro ao atualizar: {str(e)}', 'danger')

    return render_template('admin/produto_form.html', produto=produto, categorias=categorias)

@admin_bp.route('/produtos/<int:produto_id>/status', methods=['POST'])
def produto_status(produto_id):
    ProdutoService.alternar_status(produto_id)
    flash('Status do produto alterado!', 'info')
    return redirect(url_for('admin.produtos'))

@admin_bp.route('/produtos/<int:produto_id>/excluir', methods=['POST'])
def produto_excluir(produto_id):
    resultado = ProdutoService.excluir_ou_desativar(produto_id)
    if resultado == 'deactivated':
        flash('Produto desativado com sucesso (mantido no histórico de pedidos anteriores).', 'warning')
    else:
        flash('Produto excluído com sucesso.', 'success')
    return redirect(url_for('admin.produtos'))

# ----------------- CATEGORIAS -----------------
@admin_bp.route('/categorias')
def categorias():
    lista = CategoriaModel.list_all(somente_ativas=False)
    return render_template('admin/categorias.html', categorias=lista)

@admin_bp.route('/categorias/salvar', methods=['POST'])
def categoria_salvar():
    categoria_id = request.form.get('id', type=int)
    nome = request.form.get('nome')
    descricao = request.form.get('descricao', '')
    ordem = request.form.get('ordem', default=0, type=int)
    ativo = 1 if request.form.get('ativo') else 0

    if not nome:
        flash('Nome da categoria é obrigatório.', 'danger')
        return redirect(url_for('admin.categorias'))

    if categoria_id:
        CategoriaModel.update(categoria_id, nome, descricao, ativo, ordem)
        flash('Categoria atualizada com sucesso!', 'success')
    else:
        CategoriaModel.create(nome, descricao, ativo, ordem)
        flash('Categoria criada com sucesso!', 'success')

    return redirect(url_for('admin.categorias'))

@admin_bp.route('/categorias/<int:categoria_id>/status', methods=['POST'])
def categoria_status(categoria_id):
    CategoriaModel.toggle_ativo(categoria_id)
    flash('Status da categoria atualizado!', 'info')
    return redirect(url_for('admin.categorias'))

# ----------------- CLIENTES -----------------
@admin_bp.route('/clientes')
def clientes():
    lista = ClienteService.listar_todos()
    return render_template('admin/clientes.html', clientes=lista)

@admin_bp.route('/clientes/<int:cliente_id>')
def cliente_detalhe(cliente_id):
    cliente = ClienteService.obter_por_id(cliente_id)
    if not cliente:
        flash('Cliente não encontrado.', 'warning')
        return redirect(url_for('admin.clientes'))
    
    pedidos_cliente = PedidoModel.list_by_cliente(cliente_id)
    return render_template('admin/cliente_detalhe.html', cliente=cliente, pedidos=pedidos_cliente)

# ----------------- CONFIGURAÇÕES -----------------
@admin_bp.route('/configuracoes', methods=['GET', 'POST'])
def configuracoes():
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == 'POST':
        taxa = request.form.get('taxa_entrega', '7.50')
        nome = request.form.get('nome_loja', 'Casa de Bolos')
        tel = request.form.get('telefone_loja', '(11) 98765-4321')
        end = request.form.get('endereco_loja', '')

        cursor.execute("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('taxa_entrega', ?)", (taxa,))
        cursor.execute("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('nome_loja', ?)", (nome,))
        cursor.execute("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('telefone_loja', ?)", (tel,))
        cursor.execute("INSERT OR REPLACE INTO configuracoes (chave, valor) VALUES ('endereco_loja', ?)", (end,))
        conn.commit()
        flash('Configurações da confeitaria salvas com sucesso!', 'success')

    cursor.execute("SELECT chave, valor FROM configuracoes")
    configs = {row['chave']: row['valor'] for row in cursor.fetchall()}
    conn.close()

    return render_template('admin/configuracoes.html', configs=configs)
