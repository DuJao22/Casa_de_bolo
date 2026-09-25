export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  created_at: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  ordem: number;
}

export interface Produto {
  id: number;
  categoria_id: number;
  categoria_nome?: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  ativo: boolean;
  destaque: boolean;
  created_at?: string;
}

export interface ItemCarrinho {
  produto_id: number;
  nome: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
  observacao?: string;
  imagem?: string;
}

export type TipoEntrega = 'retirada' | 'entrega';

export type StatusPedido = 
  | 'NOVO'
  | 'CONFIRMADO'
  | 'EM PREPARO'
  | 'PRONTO'
  | 'PRONTO PARA RETIRADA'
  | 'SAIU PARA ENTREGA'
  | 'ENTREGUE'
  | 'RETIRADO'
  | 'CANCELADO';

export interface PedidoItem {
  id: number;
  pedido_id: number;
  produto_id: number;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  observacao?: string;
}

export interface Pedido {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  cliente_telefone: string;
  tipo_entrega: TipoEntrega;
  status: StatusPedido;
  subtotal: number;
  taxa_entrega: number;
  total: number;
  observacao?: string;
  endereco_entrega: string;
  itens: PedidoItem[];
  created_at: string;
}

export type StatusAvaliacao = 'aprovada' | 'pendente' | 'rejeitada';

export interface Avaliacao {
  id: number;
  produto_id: number;
  produto_nome: string;
  pedido_id: number;
  cliente_id: number;
  cliente_nome: string;
  nota: number; // 1 a 5
  comentario: string;
  status: StatusAvaliacao;
  resposta_admin?: string;
  created_at: string;
}

export type TipoNotificacao = 'status_pedido' | 'nova_avaliacao' | 'novo_pedido' | 'sistema';
export type DestinatarioNotificacao = 'cliente' | 'admin' | 'ambos';

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  destinatario: DestinatarioNotificacao;
  titulo: string;
  mensagem: string;
  pedido_id?: number;
  cliente_id?: number;
  cliente_nome?: string;
  lida: boolean;
  created_at: string;
  whatsapp_preview?: {
    telefone: string;
    texto: string;
  };
  sms_preview?: {
    telefone: string;
    texto: string;
  };
}

export interface LojaConfig {
  nome: string;
  telefone: string;
  endereco: string;
  taxa_entrega: number;
}
