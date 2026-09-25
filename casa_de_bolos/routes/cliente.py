from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from services.cliente_service import ClienteService

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('/')
def index():
    cliente = None
    if 'cliente_id' in session:
        cliente = ClienteService.obter_por_id(session['cliente_id'])
    return render_template('index.html', cliente=cliente)

@cliente_bp.route('/identificacao', methods=['GET', 'POST'])
def identificacao():
    if request.method == 'POST':
        telefone = request.form.get('telefone', '').strip()
        if not telefone:
            flash('Por favor, informe seu telefone.', 'warning')
            return render_template('identificacao.html')
        
        cliente = ClienteService.identificar_por_telefone(telefone)
        if cliente:
            session['cliente_id'] = cliente['id']
            session['cliente_nome'] = cliente['nome']
            flash(f"Olá, {cliente['nome']}! Que bom ter você de volta.", 'success')
            return redirect(url_for('catalogo.listar'))
        else:
            flash('Parece que é seu primeiro pedido por aqui. Vamos fazer seu cadastro rapidinho.', 'info')
            return redirect(url_for('cliente.cadastro', telefone=telefone))

    return render_template('identificacao.html')

@cliente_bp.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    telefone_inicial = request.args.get('telefone', '')
    if request.method == 'POST':
        nome = request.form.get('nome', '').strip()
        telefone = request.form.get('telefone', '').strip()
        endereco = request.form.get('endereco', '').strip()
        numero = request.form.get('numero', '').strip()
        complemento = request.form.get('complemento', '').strip()
        bairro = request.form.get('bairro', '').strip()
        cidade = request.form.get('cidade', '').strip()

        if not nome or not telefone:
            flash('Nome e telefone são campos obrigatórios.', 'danger')
            return render_template('cadastro.html', telefone=telefone)

        try:
            cliente = ClienteService.cadastrar_cliente(
                nome=nome,
                telefone=telefone,
                endereco=endereco,
                numero=numero,
                complemento=complemento,
                bairro=bairro,
                cidade=cidade
            )
            session['cliente_id'] = cliente['id']
            session['cliente_nome'] = cliente['nome']
            flash(f"Bem-vindo(a) à Casa de Bolos, {cliente['nome']}!", 'success')
            return redirect(url_for('catalogo.listar'))
        except Exception as e:
            flash(f'Erro ao cadastrar: {str(e)}', 'danger')
            return render_template('cadastro.html', telefone=telefone)

    return render_template('cadastro.html', telefone=telefone_inicial)

@cliente_bp.route('/sair')
def logout():
    session.pop('cliente_id', None)
    session.pop('cliente_nome', None)
    flash('Você saiu do seu atendimento.', 'info')
    return redirect(url_for('cliente.index'))
