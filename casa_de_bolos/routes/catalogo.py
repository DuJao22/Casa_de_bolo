from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from services.produto_service import ProdutoService
from models.categoria import CategoriaModel

catalogo_bp = Blueprint('catalogo', __name__)

@catalogo_bp.route('/catalogo')
def listar():
    categoria_id = request.args.get('categoria', type=int)
    categorias = CategoriaModel.list_all(somente_ativas=True)
    produtos = ProdutoService.listar_catalogo(categoria_id=categoria_id)
    
    # Calcular contagem do carrinho
    carrinho = session.get('carrinho', [])
    total_itens_carrinho = sum(item['quantidade'] for item in carrinho)
    
    return render_template(
        'catalogo.html',
        categorias=categorias,
        produtos=produtos,
        categoria_ativa=categoria_id,
        total_itens_carrinho=total_itens_carrinho
    )

@catalogo_bp.route('/produto/<int:produto_id>')
def detalhe(produto_id):
    produto = ProdutoService.obter_produto(produto_id)
    if not produto or not produto['ativo']:
        flash('Produto não encontrado ou indisponível.', 'warning')
        return redirect(url_for('catalogo.listar'))
    
    return render_template('produto.html', produto=produto)
