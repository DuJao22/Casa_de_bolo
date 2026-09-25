from models.cliente import ClienteModel

class ClienteService:
    @staticmethod
    def identificar_por_telefone(telefone):
        if not telefone:
            return None
        return ClienteModel.find_by_telefone(telefone)

    @staticmethod
    def cadastrar_cliente(nome, telefone, endereco="", numero="", complemento="", bairro="", cidade=""):
        if not nome or not telefone:
            raise ValueError("Nome e telefone são obrigatórios.")
        
        existente = ClienteModel.find_by_telefone(telefone)
        if existente:
            return existente
            
        return ClienteModel.create(nome, telefone, endereco, numero, complemento, bairro, cidade)

    @staticmethod
    def atualizar_endereco(cliente_id, endereco, numero, complemento, bairro, cidade):
        return ClienteModel.update_endereco(cliente_id, endereco, numero, complemento, bairro, cidade)

    @staticmethod
    def listar_todos():
        return ClienteModel.list_all()

    @staticmethod
    def obter_por_id(cliente_id):
        return ClienteModel.get_by_id(cliente_id)
