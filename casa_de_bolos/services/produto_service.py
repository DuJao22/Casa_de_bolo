from models.produto import ProdutoModel
from models.categoria import CategoriaModel

class ProdutoService:
    @staticmethod
    def listar_catalogo(categoria_id=None):
        return ProdutoModel.list_all(somente_ativos=True, categoria_id=categoria_id)

    @staticmethod
    def listar_todos_admin():
        return ProdutoModel.list_all(somente_ativos=False)

    @staticmethod
    def obter_produto(produto_id):
        return ProdutoModel.get_by_id(produto_id)

    @staticmethod
    def salvar_produto(categoria_id, nome, descricao, preco, imagem, ativo=1, destaque=0, produto_id=None):
        if not nome or not preco or not categoria_id:
            raise ValueError("Nome, preço e categoria são obrigatórios.")
        
        if produto_id:
            return ProdutoModel.update(produto_id, categoria_id, nome, descricao, preco, imagem, ativo, destaque)
        else:
            return ProdutoModel.create(categoria_id, nome, descricao, preco, imagem, ativo, destaque)

    @staticmethod
    def alternar_status(produto_id):
        ProdutoModel.toggle_ativo(produto_id)

    @staticmethod
    def excluir_ou_desativar(produto_id):
        return ProdutoModel.delete_or_deactivate(produto_id)
