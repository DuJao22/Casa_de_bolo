from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from services.pedido_service import PedidoService
from services.produto_service import ProdutoService
from services.cliente_service import ClienteService

pedido_bp = Blueprint('pedido', __name__)

@pedido_bp.route('/carrinho')
def ver_carrinho():
    carrinho = session.get('carrinho', [])
    subtotal = sum(item['subtotal'] for item in carrinho)
    tipo_entrega = session.get('tipo_entrega', 'retirada')
    taxa_entrega = PedidoService.get_taxa_entrega() if tipo_entrega == 'entrega' else 0.0
    total = subtotal + taxa_entrega
    
    return render_template('carrinho.html', 
                           carrinho=carrinho, 
                           subtotal=subtotal, 
                           taxa_entrega=taxa_entrega, 
                           total=total,
                           tipo_entrega=tipo_entrega)

@pedido_bp.route('/carrinho/adicionar', methods=['POST'])
def adicionar_item():
    produto_id = request.form.get('produto_id', type=int)
    quantidade = request.form.get('quantidade', default=1, type=int)
    observacao = request.form.get('observacao', '').strip()

    if not produto_id or quantidade <= 0:
        flash('Dados do produto inválidos.', 'danger')
        return redirect(url_for('catalogo.listar'))

    produto = ProdutoService.obter_produto(produto_id)
    if not produto or not produto['ativo']:
        flash('Produto não disponível.', 'warning')
        return redirect(url_for('catalogo.listar'))

    carrinho = session.get('carrinho', [])
    
    # Verifica se já existe item idêntico (mesmo produto e mesma observação)
    item_existente = False
    for item in carrinho:
        if item['produto_id'] == produto_id and item.get('observacao', '') == observacao:
            item['quantidade'] += quantidade
            item['subtotal'] = item['quantidade'] * item['preco_unitario']
            item_existente = True
            break

    if not item_existente:
        carrinho.append({
            'produto_id': produto['id'],
            'nome': produto['nome'],
            'preco_unitario': float(produto['preco']),
            'quantidade': quantidade,
            'subtotal': round(float(produto['preco']) * quantidade, 2),
            'observacao': observacao,
            'imagem': produto.get('imagem', '')
        })

    session['carrinho'] = carrinho
    flash(f'{produto["nome"]} adicionado ao seu pedido!', 'success')
    return redirect(url_for('pedido.ver_carrinho'))

@pedido_bp.route('/carrinho/atualizar', methods=['POST'])
def atualizar_carrinho():
    index = request.form.get('index', type=int)
    acao = request.form.get('acao') # 'mais', 'menos', 'remover'
    
    carrinho = session.get('carrinho', [])
    if 0 <= index < len(carrinho):
        if acao == 'mais':
            carrinho[index]['quantidade'] += 1
            carrinho[index]['subtotal'] = round(carrinho[index]['quantidade'] * carrinho[index]['preco_unitario'], 2)
        elif acao == 'menos':
            carrinho[index]['quantidade'] -= 1
            if carrinho[index]['quantidade'] <= 0:
                carrinho.pop(index)
            else:
                carrinho[index]['subtotal'] = round(carrinho[index]['quantidade'] * carrinho[index]['preco_unitario'], 2)
        elif acao == 'remover':
            carrinho.pop(index)

    session['carrinho'] = carrinho
    return redirect(url_for('pedido.ver_carrinho'))

@pedido_bp.route('/entrega', methods=['GET', 'POST'])
def entrega():
    if not session.get('cliente_id'):
        flash('Por favor, informe seu telefone para continuar seu pedido.', 'info')
        return redirect(url_for('cliente.identificacao'))

    carrinho = session.get('carrinho', [])
    if not carrinho:
        flash('Seu carrinho está vazio.', 'warning')
        return redirect(url_for('catalogo.listar'))

    cliente = ClienteService.obter_por_id(session['cliente_id'])
    taxa_entrega = PedidoService.get_taxa_entrega()

    if request.method == 'POST':
        tipo = request.form.get('tipo_entrega', 'retirada')
        session['tipo_entrega'] = tipo

        if tipo == 'entrega':
            endereco = request.form.get('endereco', '').strip()
            numero = request.form.get('numero', '').strip()
            complemento = request.form.get('complemento', '').strip()
            bairro = request.form.get('bairro', '').strip()
            cidade = request.form.get('cidade', '').strip()

            if not endereco or not numero or not bairro or not cidade:
                flash('Por favor, preencha todos os dados obrigatórios do endereço de entrega.', 'danger')
                return render_template('entrega.html', cliente=cliente, taxa_entrega=taxa_entrega, tipo_selecionado=tipo)

            endereco_completo = f"{endereco}, {numero}"
            if complemento:
                endereco_completo += f" ({complemento})"
            endereco_completo += f" - {bairro}, {cidade}"

            session['endereco_entrega'] = endereco_completo
            # Atualiza o cadastro do cliente para facilitar próximos pedidos
            ClienteService.atualizar_endereco(cliente['id'], endereco, numero, complemento, bairro, cidade)
        else:
            session['endereco_entrega'] = "Retirada no balcão da loja"

        return redirect(url_for('pedido.resumo'))

    return render_template('entrega.html', cliente=cliente, taxa_entrega=taxa_entrega)

@pedido_bp.route('/resumo')
def resumo():
    if not session.get('cliente_id'):
        return redirect(url_for('cliente.identificacao'))

    carrinho = session.get('carrinho', [])
    if not carrinho:
        return redirect(url_for('catalogo.listar'))

    cliente = ClienteService.obter_por_id(session['cliente_id'])
    tipo_entrega = session.get('tipo_entrega', 'retirada')
    endereco_entrega = session.get('endereco_entrega', '')
    subtotal = sum(item['subtotal'] for item in carrinho)
    taxa_entrega = PedidoService.get_taxa_entrega() if tipo_entrega == 'entrega' else 0.0
    total = subtotal + taxa_entrega

    return render_template('resumo.html',
                           cliente=cliente,
                           carrinho=carrinho,
                           tipo_entrega=tipo_entrega,
                           endereco_entrega=endereco_entrega,
                           subtotal=subtotal,
                           taxa_entrega=taxa_entrega,
                           total=total)

@pedido_bp.route('/confirmar', methods=['POST'])
def confirmar():
    if not session.get('cliente_id'):
        return redirect(url_for('cliente.identificacao'))

    carrinho = session.get('carrinho', [])
    if not carrinho:
        flash('Seu carrinho está vazio.', 'warning')
        return redirect(url_for('catalogo.listar'))

    cliente_id = session['cliente_id']
    tipo_entrega = session.get('tipo_entrega', 'retirada')
    endereco_entrega = session.get('endereco_entrega', 'Retirada na loja')
    observacao = request.form.get('observacao_pedido', '').strip()

    try:
        pedido = PedidoService.criar_pedido(
            cliente_id=cliente_id,
            tipo_entrega=tipo_entrega,
            itens=carrinho,
            observacao=observacao,
            endereco_entrega=endereco_entrega
        )
        # Limpa o carrinho
        session.pop('carrinho', None)
        session.pop('endereco_entrega', None)
        return redirect(url_for('pedido.confirmado', pedido_id=pedido['id']))
    except Exception as e:
        flash(f'Erro ao confirmar pedido: {str(e)}', 'danger')
        return redirect(url_for('pedido.resumo'))

@pedido_bp.route('/pedido/<int:pedido_id>/confirmado')
def confirmado(pedido_id):
    pedido = PedidoService.obter_pedido(pedido_id)
    if not pedido:
        flash('Pedido não encontrado.', 'warning')
        return redirect(url_for('cliente.index'))
    return render_template('pedido_confirmado.html', pedido=pedido)
