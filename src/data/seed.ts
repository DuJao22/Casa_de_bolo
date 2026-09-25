import { Categoria, Produto, Cliente, Pedido, LojaConfig, Avaliacao, Notificacao } from '../types';

export const INITIAL_CONFIG: LojaConfig = {
  nome: 'Casa de Bolos',
  telefone: '(11) 98765-4321',
  endereco: 'Rua das Confeitarias, 120 - Centro, São Paulo - SP',
  taxa_entrega: 7.50
};

export const INITIAL_CATEGORIES: Categoria[] = [
  { id: 1, nome: 'Bolos Caseiros', descricao: 'Receitas tradicionais fofinhas para acompanhar o café', ativo: true, ordem: 1 },
  { id: 2, nome: 'Bolos de Chocolate', descricao: 'Massa fofinha com coberturas generosas de chocolate', ativo: true, ordem: 2 },
  { id: 3, nome: 'Bolos Recheados', descricao: 'Camadas macias com recheios nobres e artesanais', ativo: true, ordem: 3 },
  { id: 4, nome: 'Doces & Fatias', descricao: 'Docinhos, brigadeiros e porções individuais', ativo: true, ordem: 4 },
  { id: 5, nome: 'Combos Especiais', descricao: 'Combos de bolo + docinhos para comemorações', ativo: true, ordem: 5 }
];

export const INITIAL_PRODUCTS: Produto[] = [
  {
    id: 1,
    categoria_id: 2,
    nome: 'Bolo de Chocolate Vulcão',
    descricao: 'Massa artesanal de cacau 50% com cobertura vulcão de brigadeiro belga cremoso e raspas nobres.',
    preco: 42.00,
    imagem: '/src/assets/images/bolo_chocolate_1790270003751.jpg',
    ativo: true,
    destaque: true
  },
  {
    id: 2,
    categoria_id: 1,
    nome: 'Bolo de Cenoura com Brigadeiro',
    descricao: 'O clássico brasileiro: massa leve e úmida de cenoura fresca com calda aveludada de brigadeiro.',
    preco: 38.00,
    imagem: '/src/assets/images/bolo_cenoura_1790270013963.jpg',
    ativo: true,
    destaque: true
  },
  {
    id: 3,
    categoria_id: 3,
    nome: 'Bolo Red Velvet com Frutas Vermelhas',
    descricao: 'Massa aveludada, recheio de cream cheese suave e morangos frescos selecionados.',
    preco: 54.00,
    imagem: '/src/assets/images/bolo_red_velvet_1790270024304.jpg',
    ativo: true,
    destaque: true
  },
  {
    id: 4,
    categoria_id: 1,
    nome: 'Bolo de Fubá com Goiabada',
    descricao: 'Receita tradicional de família com massa de milho macia e pedaços derretidos de goiabada cascão.',
    preco: 32.00,
    imagem: '/src/assets/images/bolo_fuba_1790270033895.jpg',
    ativo: true,
    destaque: false
  },
  {
    id: 5,
    categoria_id: 2,
    nome: 'Bolo Prestígio Cremoso',
    descricao: 'Massa de chocolate intenso com recheio cremoso de coco fresco ralado e ganache meio amargo.',
    preco: 46.00,
    imagem: '/src/assets/images/bolo_chocolate_1790270003751.jpg',
    ativo: true,
    destaque: false
  },
  {
    id: 6,
    categoria_id: 4,
    nome: 'Caixa de Brigadeiros Gourmet (6 un)',
    descricao: 'Sortidos: 2 Tradicionais Belga, 2 Ninho com Nutella e 2 Pistache artesanal.',
    preco: 24.00,
    imagem: '/src/assets/images/hero_confeitaria_1790270043414.jpg',
    ativo: true,
    destaque: true
  },
  {
    id: 7,
    categoria_id: 5,
    nome: 'Combo Café da Tarde Especial',
    descricao: '1 Bolo Caseiro à escolha + 4 fatias especiais + 1 pacote de café especial moído 250g.',
    preco: 69.90,
    imagem: '/src/assets/images/hero_confeitaria_1790270043414.jpg',
    ativo: true,
    destaque: true
  }
];

export const INITIAL_CUSTOMERS: Cliente[] = [
  {
    id: 1,
    nome: 'João da Silva',
    telefone: '(11) 98765-1111',
    endereco: 'Rua das Flores',
    numero: '450',
    complemento: 'Apto 32',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    created_at: '2026-09-20 14:30'
  },
  {
    id: 2,
    nome: 'Maria Oliveira',
    telefone: '(11) 98765-2222',
    endereco: 'Av. Paulista',
    numero: '1200',
    complemento: 'Bloco B',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    created_at: '2026-09-22 09:15'
  }
];

export const INITIAL_ORDERS: Pedido[] = [
  {
    id: 1042,
    cliente_id: 1,
    cliente_nome: 'João da Silva',
    cliente_telefone: '(11) 98765-1111',
    tipo_entrega: 'entrega',
    status: 'EM PREPARO',
    subtotal: 52.40,
    taxa_entrega: 7.50,
    total: 59.90,
    observacao: 'Favor enviar bem embalado para presente com laço',
    endereco_entrega: 'Rua das Flores, 450 (Apto 32) - Jardins, São Paulo',
    itens: [
      { id: 1, pedido_id: 1042, produto_id: 1, produto_nome: 'Bolo de Chocolate Vulcão', quantidade: 1, preco_unitario: 42.00, subtotal: 42.00, observacao: 'Caprichar no brigadeiro' },
      { id: 2, pedido_id: 1042, produto_id: 6, produto_nome: 'Caixa de Brigadeiros Gourmet (6 un)', quantidade: 1, preco_unitario: 10.40, subtotal: 10.40 }
    ],
    created_at: '2026-09-24 10:05'
  },
  {
    id: 1041,
    cliente_id: 2,
    cliente_nome: 'Maria Oliveira',
    cliente_telefone: '(11) 98765-2222',
    tipo_entrega: 'retirada',
    status: 'PRONTO PARA RETIRADA',
    subtotal: 38.00,
    taxa_entrega: 0,
    total: 38.00,
    observacao: 'Vou retirar por volta das 11h',
    endereco_entrega: 'Retirada no balcão da loja',
    itens: [
      { id: 3, pedido_id: 1041, produto_id: 2, produto_nome: 'Bolo de Cenoura com Brigadeiro', quantidade: 1, preco_unitario: 38.00, subtotal: 38.00 }
    ],
    created_at: '2026-09-24 09:30'
  },
  {
    id: 1040,
    cliente_id: 1,
    cliente_nome: 'João da Silva',
    cliente_telefone: '(11) 98765-1111',
    tipo_entrega: 'entrega',
    status: 'ENTREGUE',
    subtotal: 76.00,
    taxa_entrega: 7.50,
    total: 83.50,
    observacao: 'Deixar na portaria com o seu Carlos',
    endereco_entrega: 'Rua das Flores, 450 (Apto 32) - Jardins, São Paulo',
    itens: [
      { id: 4, pedido_id: 1040, produto_id: 2, produto_nome: 'Bolo de Cenoura com Brigadeiro', quantidade: 1, preco_unitario: 38.00, subtotal: 38.00 },
      { id: 5, pedido_id: 1040, produto_id: 4, produto_nome: 'Bolo de Fubá com Goiabada', quantidade: 1, preco_unitario: 38.00, subtotal: 38.00 }
    ],
    created_at: '2026-09-23 16:20'
  },
  {
    id: 1039,
    cliente_id: 2,
    cliente_nome: 'Maria Oliveira',
    cliente_telefone: '(11) 98765-2222',
    tipo_entrega: 'retirada',
    status: 'RETIRADO',
    subtotal: 54.00,
    taxa_entrega: 0,
    total: 54.00,
    observacao: 'Para festa surpresa de aniversário',
    endereco_entrega: 'Retirada no balcão da loja',
    itens: [
      { id: 6, pedido_id: 1039, produto_id: 3, produto_nome: 'Bolo Red Velvet com Frutas Vermelhas', quantidade: 1, preco_unitario: 54.00, subtotal: 54.00 }
    ],
    created_at: '2026-09-23 14:10'
  }
];

export const INITIAL_REVIEWS: Avaliacao[] = [
  {
    id: 1,
    produto_id: 1,
    produto_nome: 'Bolo de Chocolate Vulcão',
    pedido_id: 1038,
    cliente_id: 1,
    cliente_nome: 'João da Silva',
    nota: 5,
    comentario: 'Simplesmente divino! O vulcão de brigadeiro escorrendo na primeira fatia foi um espetáculo. Massa macia e cacau de excelente qualidade.',
    status: 'aprovada',
    resposta_admin: 'Muito obrigado, João! Nosso brigadeiro belga é feito na panela todo dia com muito amor. Até a próxima!',
    created_at: '2026-09-22 17:40'
  },
  {
    id: 2,
    produto_id: 2,
    produto_nome: 'Bolo de Cenoura com Brigadeiro',
    pedido_id: 1037,
    cliente_id: 2,
    cliente_nome: 'Maria Oliveira',
    nota: 5,
    comentario: 'O clássico perfeito. Nem muito doce, massa bem alaranjada e fofinha, cobertura aveludada. Me lembrou bolo de vó!',
    status: 'aprovada',
    resposta_admin: 'Ficamos emocionados com o carinho, Maria! Essa receita é da dona Laura há 30 anos.',
    created_at: '2026-09-23 11:25'
  },
  {
    id: 3,
    produto_id: 3,
    produto_nome: 'Bolo Red Velvet com Frutas Vermelhas',
    pedido_id: 1039,
    cliente_id: 2,
    cliente_nome: 'Maria Oliveira',
    nota: 5,
    comentario: 'Incrível! Morangos frescos e o recheio de cream cheese tem a medida exata. Fez o maior sucesso na festa!',
    status: 'aprovada',
    created_at: '2026-09-23 18:30'
  },
  {
    id: 4,
    produto_id: 1,
    produto_nome: 'Bolo de Chocolate Vulcão',
    pedido_id: 1035,
    cliente_id: 2,
    cliente_nome: 'Lucas Santos',
    nota: 4,
    comentario: 'Muito gostoso e chegou quentinho. Só achei um pouco doce demais para o meu gosto, mas a família inteira adorou.',
    status: 'aprovada',
    resposta_admin: 'Agradecemos o feedback, Lucas! Experimente nosso Meio Amargo Especial no próximo pedido.',
    created_at: '2026-09-21 15:10'
  },
  {
    id: 5,
    produto_id: 6,
    produto_nome: 'Caixa de Brigadeiros Gourmet (6 un)',
    pedido_id: 1036,
    cliente_id: 1,
    cliente_nome: 'Fernanda Lima',
    nota: 5,
    comentario: 'O de pistache é sensacional! Textura aveludada que derrete na boca.',
    status: 'pendente',
    created_at: '2026-09-24 08:45'
  }
];

export const INITIAL_NOTIFICATIONS: Notificacao[] = [
  {
    id: 1,
    tipo: 'status_pedido',
    destinatario: 'ambos',
    titulo: 'Pedido #1042 em Preparo',
    mensagem: 'O confeiteiro iniciou o preparo do Pedido #1042 (João da Silva). Previsão de saída em 25 minutos.',
    pedido_id: 1042,
    cliente_id: 1,
    cliente_nome: 'João da Silva',
    lida: false,
    created_at: '2026-09-24 10:05',
    whatsapp_preview: {
      telefone: '(11) 98765-1111',
      texto: '🍰 *Casa de Bolos:* Olá João! Seu Pedido #1042 já está sendo preparado com muito carinho pela nossa confeiteira. Acompanhe pelo nosso site!'
    },
    sms_preview: {
      telefone: '(11) 98765-1111',
      texto: 'Casa de Bolos: Seu pedido #1042 esta em preparo! Previsao em 25 min.'
    }
  },
  {
    id: 2,
    tipo: 'status_pedido',
    destinatario: 'ambos',
    titulo: 'Pedido #1041 Pronto para Retirada',
    mensagem: 'Pedido #1041 (Maria Oliveira) está embalado e aguardando no balcão da loja.',
    pedido_id: 1041,
    cliente_id: 2,
    cliente_nome: 'Maria Oliveira',
    lida: true,
    created_at: '2026-09-24 09:30',
    whatsapp_preview: {
      telefone: '(11) 98765-2222',
      texto: '🏪 *Casa de Bolos:* Olá Maria! Seu Pedido #1041 está quentinho e pronto para retirada no nosso balcão. Esperamos você!'
    },
    sms_preview: {
      telefone: '(11) 98765-2222',
      texto: 'Casa de Bolos: Seu pedido #1041 esta pronto para retirada no balcao!'
    }
  },
  {
    id: 3,
    tipo: 'nova_avaliacao',
    destinatario: 'admin',
    titulo: 'Nova Avaliação Recebida ⭐ 5.0',
    mensagem: 'Fernanda Lima avaliou Caixa de Brigadeiros Gourmet (6 un) com 5 estrelas. Aguardando moderação.',
    lida: false,
    created_at: '2026-09-24 08:45'
  }
];
