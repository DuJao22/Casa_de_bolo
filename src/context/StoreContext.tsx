import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Cliente,
  Categoria,
  Produto,
  ItemCarrinho,
  TipoEntrega,
  StatusPedido,
  Pedido,
  LojaConfig,
  Avaliacao,
  StatusAvaliacao,
  Notificacao
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS
} from '../data/seed';
import { formatCurrency } from '../utils/format';

// Audio chime helper using Web Audio API
const tocarSomNotificacao = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio permission or context errors
  }
};

interface StoreContextType {
  config: LojaConfig;
  atualizarConfig: (novaConfig: Partial<LojaConfig>) => void;
  categorias: Categoria[];
  salvarCategoria: (cat: Partial<Categoria>) => void;
  alternarCategoria: (id: number) => void;
  produtos: Produto[];
  salvarProduto: (prod: Partial<Produto>) => void;
  alternarStatusProduto: (id: number) => void;
  excluirOuDesativarProduto: (id: number) => 'deactivated' | 'deleted';
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  identificarPorTelefone: (telefone: string) => Cliente | null;
  cadastrarCliente: (dados: { nome: string; telefone: string; endereco?: string; numero?: string; complemento?: string; bairro?: string; cidade?: string }) => Cliente;
  logoutCliente: () => void;
  carrinho: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto, quantidade: number, observacao?: string) => void;
  atualizarQtdCarrinho: (index: number, delta: number) => void;
  removerDoCarrinho: (index: number) => void;
  limparCarrinho: () => void;
  tipoEntrega: TipoEntrega;
  setTipoEntrega: (tipo: TipoEntrega) => void;
  enderecoEntrega: string;
  setEnderecoEntrega: (end: string) => void;
  pedidos: Pedido[];
  criarPedido: (observacaoGeral?: string) => Pedido;
  atualizarStatusPedido: (pedidoId: number, novoStatus: StatusPedido) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  produtoModal: Produto | null;
  setProdutoModal: (prod: Produto | null) => void;
  ultimoPedidoCriado: Pedido | null;
  setUltimoPedidoCriado: (pedido: Pedido | null) => void;
  // Sistema de Avaliações
  avaliacoes: Avaliacao[];
  adicionarAvaliacao: (dados: { produto_id: number; produto_nome: string; pedido_id: number; nota: number; comentario: string }) => void;
  moderarAvaliacao: (id: number, status: StatusAvaliacao) => void;
  responderAvaliacao: (id: number, resposta: string) => void;
  excluirAvaliacao: (id: number) => void;
  obterAvaliacoesProduto: (produtoId: number, apenasAprovadas?: boolean) => Avaliacao[];
  obterMediaAvaliacoes: (produtoId: number) => { media: number; total: number };
  obterPedidosParaAvaliar: (clienteId: number) => Pedido[];
  pedidoParaAvaliar: Pedido | null;
  setPedidoParaAvaliar: (p: Pedido | null) => void;
  // Sistema de Notificações
  notificacoes: Notificacao[];
  toastAtual: Notificacao | null;
  setToastAtual: (notif: Notificacao | null) => void;
  marcarNotificacaoLida: (id: number) => void;
  limparNotificacoes: () => void;
  // Autenticação Admin (dujao / 30031936)
  adminAutenticado: boolean;
  loginAdmin: (usuario: string, senha: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Limpeza preventiva de dados de teste antigos armazenados em versões anteriores
  if (typeof window !== 'undefined' && localStorage.getItem('cdb_autofill_cleaned') !== 'v3') {
    localStorage.removeItem('cdb_cliente_atual');
    localStorage.removeItem('cdb_carrinho');
    localStorage.setItem('cdb_autofill_cleaned', 'v3');
  }

  // Autenticação do Administrador (dujao / 30031936)
  const [adminAutenticado, setAdminAutenticado] = useState<boolean>(() => {
    return localStorage.getItem('cdb_admin_auth') === 'true';
  });

  const loginAdmin = (usuario: string, senha: string): boolean => {
    if (usuario.trim().toLowerCase() === 'dujao' && senha === '30031936') {
      setAdminAutenticado(true);
      localStorage.setItem('cdb_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminAutenticado(false);
    localStorage.removeItem('cdb_admin_auth');
  };

  // Config
  const [config, setConfig] = useState<LojaConfig>(() => {
    const saved = localStorage.getItem('cdb_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.taxa_entrega === 'number') {
          return { ...INITIAL_CONFIG, ...parsed };
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_CONFIG;
  });

  // Categorias
  const [categorias, setCategorias] = useState<Categoria[]>(() => {
    const saved = localStorage.getItem('cdb_categorias');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_CATEGORIES;
  });

  // Produtos
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const saved = localStorage.getItem('cdb_produtos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Clientes
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('cdb_clientes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Cliente Atual na sessão (sem preenchimento automático, usuário deve logar ou cadastrar)
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(() => {
    const saved = localStorage.getItem('cdb_cliente_atual');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nome && parsed.telefone) return parsed;
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Carrinho de compras (inicia vazio, sem produtos automáticos)
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>(() => {
    const saved = localStorage.getItem('cdb_carrinho');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized: ItemCarrinho[] = parsed.map((item: any) => {
            const prod = item.produto || INITIAL_PRODUCTS.find(p => p.id === item.produto_id) || INITIAL_PRODUCTS[0];
            const preco = Number(item.preco_unitario ?? prod?.preco ?? 0);
            const qtd = Math.max(1, Number(item.quantidade ?? 1));
            return {
              produto_id: item.produto_id ?? prod?.id ?? 1,
              nome: item.nome ?? prod?.nome ?? 'Bolo Artesanal',
              preco_unitario: preco,
              quantidade: qtd,
              subtotal: Number(item.subtotal ?? (preco * qtd)),
              observacao: item.observacao ?? '',
              imagem: item.imagem ?? prod?.imagem ?? ''
            };
          });
          return sanitized;
        }
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const saved = localStorage.getItem('cdb_pedidos');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Avaliações
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(() => {
    const saved = localStorage.getItem('cdb_avaliacoes');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Notificações
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(() => {
    const saved = localStorage.getItem('cdb_notificacoes');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Toast na tela para o usuário (auto-dismiss)
  const [toastAtual, setToastAtual] = useState<Notificacao | null>(null);

  // Modal de avaliação de pedido
  const [pedidoParaAvaliar, setPedidoParaAvaliar] = useState<Pedido | null>(null);

  // Navegação
  const [activeView, setActiveView] = useState<string>('home');
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('entrega');
  const [enderecoEntrega, setEnderecoEntrega] = useState<string>(
    'Rua das Flores, 450 (Apto 32) - Jardins, São Paulo'
  );
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null);
  const [ultimoPedidoCriado, setUltimoPedidoCriado] = useState<Pedido | null>(() => {
    return INITIAL_ORDERS[0];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cdb_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('cdb_categorias', JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem('cdb_produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('cdb_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    if (clienteAtual) {
      localStorage.setItem('cdb_cliente_atual', JSON.stringify(clienteAtual));
    } else {
      localStorage.removeItem('cdb_cliente_atual');
    }
  }, [clienteAtual]);

  useEffect(() => {
    localStorage.setItem('cdb_carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  useEffect(() => {
    localStorage.setItem('cdb_pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    localStorage.setItem('cdb_avaliacoes', JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  useEffect(() => {
    localStorage.setItem('cdb_notificacoes', JSON.stringify(notificacoes));
  }, [notificacoes]);

  // Methods
  const atualizarConfig = (novaConfig: Partial<LojaConfig>) => {
    setConfig(prev => ({ ...prev, ...novaConfig }));
  };

  const salvarCategoria = (cat: Partial<Categoria>) => {
    if (cat.id) {
      setCategorias(prev => prev.map(c => c.id === cat.id ? { ...c, ...cat } as Categoria : c));
    } else {
      const newCat: Categoria = {
        id: Date.now(),
        nome: cat.nome || 'Nova Categoria',
        descricao: cat.descricao || '',
        ativo: cat.ativo ?? true,
        ordem: cat.ordem ?? (categorias.length + 1)
      };
      setCategorias(prev => [...prev, newCat]);
    }
  };

  const alternarCategoria = (id: number) => {
    setCategorias(prev => prev.map(c => c.id === id ? { ...c, ativo: !c.ativo } : c));
  };

  const salvarProduto = (prod: Partial<Produto>) => {
    if (prod.id) {
      setProdutos(prev => prev.map(p => p.id === prod.id ? { ...p, ...prod } as Produto : p));
    } else {
      const newProd: Produto = {
        id: Date.now(),
        categoria_id: prod.categoria_id || (categorias[0]?.id || 1),
        nome: prod.nome || 'Novo Bolo',
        descricao: prod.descricao || '',
        preco: prod.preco || 35.0,
        imagem: prod.imagem || '/src/assets/images/bolo_chocolate_1790270003751.jpg',
        ativo: prod.ativo ?? true,
        destaque: prod.destaque ?? false
      };
      setProdutos(prev => [newProd, ...prev]);
    }
  };

  const alternarStatusProduto = (id: number) => {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  };

  const excluirOuDesativarProduto = (id: number): 'deactivated' | 'deleted' => {
    const temPedidos = pedidos.some(p => p.itens.some(item => item.produto_id === id));
    if (temPedidos) {
      setProdutos(prev => prev.map(p => p.id === id ? { ...p, ativo: false } : p));
      return 'deactivated';
    } else {
      setProdutos(prev => prev.filter(p => p.id !== id));
      return 'deleted';
    }
  };

  const identificarPorTelefone = (telefone: string): Cliente | null => {
    const limpo = telefone.replace(/\D/g, '');
    const encontrado = clientes.find(c => c.telefone.replace(/\D/g, '') === limpo);
    if (encontrado) {
      setClienteAtual(encontrado);
      return encontrado;
    }
    return null;
  };

  const cadastrarCliente = (dados: { nome: string; telefone: string; endereco?: string; numero?: string; complemento?: string; bairro?: string; cidade?: string }): Cliente => {
    const novo: Cliente = {
      id: Date.now(),
      nome: dados.nome.trim(),
      telefone: dados.telefone.trim(),
      endereco: dados.endereco?.trim() || '',
      numero: dados.numero?.trim() || '',
      complemento: dados.complemento?.trim() || '',
      bairro: dados.bairro?.trim() || '',
      cidade: dados.cidade?.trim() || '',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setClientes(prev => [novo, ...prev]);
    setClienteAtual(novo);
    return novo;
  };

  const logoutCliente = () => {
    setClienteAtual(null);
  };

  const adicionarAoCarrinho = (produto: Produto, quantidade: number, observacao?: string) => {
    setCarrinho(prev => {
      const obs = observacao?.trim() || '';
      const index = prev.findIndex(item => item.produto_id === produto.id && (item.observacao || '') === obs);
      if (index >= 0) {
        const copy = [...prev];
        const newQtd = copy[index].quantidade + quantidade;
        copy[index] = {
          ...copy[index],
          quantidade: newQtd,
          subtotal: Math.round(newQtd * copy[index].preco_unitario * 100) / 100
        };
        return copy;
      } else {
        const item: ItemCarrinho = {
          produto_id: produto.id,
          nome: produto.nome,
          preco_unitario: produto.preco,
          quantidade,
          subtotal: Math.round(quantidade * produto.preco * 100) / 100,
          observacao: obs,
          imagem: produto.imagem
        };
        return [...prev, item];
      }
    });
  };

  const atualizarQtdCarrinho = (index: number, delta: number) => {
    setCarrinho(prev => {
      const copy = [...prev];
      if (index >= 0 && index < copy.length) {
        const newQtd = copy[index].quantidade + delta;
        if (newQtd <= 0) {
          copy.splice(index, 1);
        } else {
          copy[index] = {
            ...copy[index],
            quantidade: newQtd,
            subtotal: Math.round(newQtd * copy[index].preco_unitario * 100) / 100
          };
        }
      }
      return copy;
    });
  };

  const removerDoCarrinho = (index: number) => {
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const criarPedido = (observacaoGeral?: string): Pedido => {
    if (!clienteAtual) {
      throw new Error('Cliente não identificado.');
    }
    if (carrinho.length === 0) {
      throw new Error('Carrinho vazio.');
    }

    const subtotal = carrinho.reduce((sum, item) => sum + (Number(item?.subtotal) || (Number(item?.preco_unitario || 0) * Number(item?.quantidade || 1)) || 0), 0);
    const taxa = tipoEntrega === 'entrega' ? (Number(config?.taxa_entrega) || 0) : 0;
    const total = Math.round((subtotal + taxa) * 100) / 100;

    const nextId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1001;

    const novoPedido: Pedido = {
      id: nextId,
      cliente_id: clienteAtual.id,
      cliente_nome: clienteAtual.nome,
      cliente_telefone: clienteAtual.telefone,
      tipo_entrega: tipoEntrega,
      status: 'NOVO',
      subtotal,
      taxa_entrega: taxa,
      total,
      observacao: observacaoGeral || '',
      endereco_entrega: tipoEntrega === 'entrega' ? enderecoEntrega : 'Retirada no balcão da loja',
      itens: carrinho.map((item, idx) => ({
        id: idx + 1,
        pedido_id: nextId,
        produto_id: item.produto_id,
        produto_nome: item.nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        subtotal: item.subtotal,
        observacao: item.observacao
      })),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setPedidos(prev => [novoPedido, ...prev]);
    setUltimoPedidoCriado(novoPedido);
    limparCarrinho();

    // Notificação de novo pedido para o administrador
    const notifAdmin: Notificacao = {
      id: Date.now(),
      tipo: 'novo_pedido',
      destinatario: 'admin',
      titulo: `Novo Pedido #${nextId} Recebido! 🍰`,
      mensagem: `${clienteAtual.nome} realizou um pedido de R$ ${formatCurrency(total)} (${novoPedido.itens.length} itens - ${tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}).`,
      pedido_id: nextId,
      cliente_id: clienteAtual.id,
      cliente_nome: clienteAtual.nome,
      lida: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      whatsapp_preview: {
        telefone: clienteAtual.telefone,
        texto: `🍰 *Casa de Bolos:* Olá ${clienteAtual.nome.split(' ')[0]}! Recebemos seu Pedido #${nextId} com sucesso. Logo começaremos o preparo!`
      },
      sms_preview: {
        telefone: clienteAtual.telefone,
        texto: `Casa de Bolos: Pedido #${nextId} recebido com sucesso!`
      }
    };

    setNotificacoes(prev => [notifAdmin, ...prev]);
    setToastAtual(notifAdmin);
    tocarSomNotificacao();

    return novoPedido;
  };

  // Atualização de Status com Disparo de Notificações
  const atualizarStatusPedido = (pedidoId: number, novoStatus: StatusPedido) => {
    const pedidoAlvo = pedidos.find(p => p.id === pedidoId);
    if (!pedidoAlvo) return;

    const antigoStatus = pedidoAlvo.status;
    if (antigoStatus === novoStatus) return;

    // Atualiza estado de pedidos
    const pedidoAtualizado: Pedido = { ...pedidoAlvo, status: novoStatus };
    setPedidos(prev => prev.map(p => p.id === pedidoId ? pedidoAtualizado : p));

    // Se o pedido atualizado for o último pedido criado na sessão, sincroniza
    if (ultimoPedidoCriado && ultimoPedidoCriado.id === pedidoId) {
      setUltimoPedidoCriado(pedidoAtualizado);
    }

    // Monta mensagens personalizadas por status
    let tituloCliente = '';
    let msgCliente = '';
    let msgWhatsApp = '';
    let msgSMS = '';

    const primeiroNome = pedidoAlvo.cliente_nome.split(' ')[0];

    switch (novoStatus) {
      case 'CONFIRMADO':
        tituloCliente = `Pedido #${pedidoId} Confirmado! 🎂`;
        msgCliente = 'A confeitaria confirmou seu pedido. Em breve começaremos a assar suas delícias!';
        msgWhatsApp = `🍰 *Casa de Bolos Informa:*\nOlá, ${primeiroNome}! Seu *Pedido #${pedidoId}* foi confirmado e já está na fila de produção da nossa cozinha.`;
        msgSMS = `Casa de Bolos: Seu Pedido #${pedidoId} foi confirmado e esta na fila de producao!`;
        break;
      case 'EM PREPARO':
        tituloCliente = `Pedido #${pedidoId} em Preparo! 👩‍🍳`;
        msgCliente = 'Nosso confeiteiro está preparando seu pedido com muito carinho e ingredientes frescos.';
        msgWhatsApp = `🍰 *Casa de Bolos Informa:*\nOlá, ${primeiroNome}! O confeiteiro já iniciou o preparo das suas delícias do *Pedido #${pedidoId}*.`;
        msgSMS = `Casa de Bolos: Seu Pedido #${pedidoId} ja esta sendo preparado pelo confeiteiro!`;
        break;
      case 'PRONTO':
        tituloCliente = `Pedido #${pedidoId} Pronto e Embalado! ✨`;
        msgCliente = 'Seu pedido foi finalizado com sucesso e embalado com todo cuidado.';
        msgWhatsApp = `🍰 *Casa de Bolos Informa:*\nOlá, ${primeiroNome}! Seu *Pedido #${pedidoId}* acabou de sair do forno/montagem e está embalado.`;
        msgSMS = `Casa de Bolos: Seu Pedido #${pedidoId} esta pronto e embalado com carinho!`;
        break;
      case 'PRONTO PARA RETIRADA':
        tituloCliente = `Pedido #${pedidoId} Disponível no Balcão! 🏪`;
        msgCliente = 'Pode vir buscar! Seu pedido quentinho está te esperando no balcão da loja.';
        msgWhatsApp = `🏪 *Casa de Bolos Informa:*\nOlá, ${primeiroNome}! Seu *Pedido #${pedidoId}* já está pronto para retirada no balcão da loja. Estamos te aguardando!`;
        msgSMS = `Casa de Bolos: Seu Pedido #${pedidoId} esta pronto para retirada no nosso balcao!`;
        break;
      case 'SAIU PARA ENTREGA':
        tituloCliente = `Pedido #${pedidoId} a Caminho! 🛵`;
        msgCliente = 'O entregador já retirou seu pedido e está a caminho do seu endereço!';
        msgWhatsApp = `🛵 *Casa de Bolos Informa:*\nOlá, ${primeiroNome}! O entregador acabou de sair com o seu *Pedido #${pedidoId}*. Fique atento à campainha!`;
        msgSMS = `Casa de Bolos: O entregador ja saiu com seu Pedido #${pedidoId} a caminho do seu endereco!`;
        break;
      case 'ENTREGUE':
        tituloCliente = `Pedido #${pedidoId} Entregue! ⭐`;
        msgCliente = 'Esperamos que você ame cada mordida! Que tal avaliar os bolos que você recebeu?';
        msgWhatsApp = `🍰 *Casa de Bolos:* Olá, ${primeiroNome}! Seu *Pedido #${pedidoId}* foi entregue. Bom apetite! Por favor, conte para nós o que achou avaliando no site. ⭐`;
        msgSMS = `Casa de Bolos: Pedido #${pedidoId} entregue! Avalie seus produtos no site. Bom apetite!`;
        break;
      case 'RETIRADO':
        tituloCliente = `Pedido #${pedidoId} Retirado com Sucesso! ⭐`;
        msgCliente = 'Obrigado por nos visitar! Que tal deixar sua avaliação sobre seus produtos?';
        msgWhatsApp = `🏪 *Casa de Bolos:* Olá, ${primeiroNome}! Seu *Pedido #${pedidoId}* foi retirado no balcão. Esperamos que tenha uma ótima experiência. Avalie no site! ⭐`;
        msgSMS = `Casa de Bolos: Pedido #${pedidoId} retirado! Deixe sua avaliacao no nosso site.`;
        break;
      case 'CANCELADO':
        tituloCliente = `Pedido #${pedidoId} Cancelado`;
        msgCliente = 'Seu pedido foi cancelado pela administração da loja. Entre em contato se precisar de ajuda.';
        msgWhatsApp = `Casa de Bolos: Olá, ${primeiroNome}. Seu Pedido #${pedidoId} foi cancelado. Se tiver dúvidas, estamos à disposição.`;
        msgSMS = `Casa de Bolos: Seu Pedido #${pedidoId} foi cancelado. Atendimento: ${config.telefone}`;
        break;
      default:
        tituloCliente = `Pedido #${pedidoId} Atualizado`;
        msgCliente = `Status alterado para: ${novoStatus}`;
        msgWhatsApp = `Casa de Bolos: Atualização do Pedido #${pedidoId}: ${novoStatus}.`;
        msgSMS = `Casa de Bolos: Pedido #${pedidoId} status: ${novoStatus}.`;
    }

    const novaNotificacao: Notificacao = {
      id: Date.now(),
      tipo: 'status_pedido',
      destinatario: 'ambos',
      titulo: tituloCliente,
      mensagem: `${msgCliente} (Cliente: ${pedidoAlvo.cliente_nome})`,
      pedido_id: pedidoId,
      cliente_id: pedidoAlvo.cliente_id,
      cliente_nome: pedidoAlvo.cliente_nome,
      lida: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      whatsapp_preview: {
        telefone: pedidoAlvo.cliente_telefone,
        texto: msgWhatsApp
      },
      sms_preview: {
        telefone: pedidoAlvo.cliente_telefone,
        texto: msgSMS
      }
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);
    setToastAtual(novaNotificacao);
    tocarSomNotificacao();
  };

  // Avaliações Methods
  const adicionarAvaliacao = (dados: { produto_id: number; produto_nome: string; pedido_id: number; nota: number; comentario: string }) => {
    const nomeCliente = clienteAtual?.nome || 'Cliente';
    const idCliente = clienteAtual?.id || 0;

    const novaAvaliacao: Avaliacao = {
      id: Date.now(),
      produto_id: dados.produto_id,
      produto_nome: dados.produto_nome,
      pedido_id: dados.pedido_id,
      cliente_id: idCliente,
      cliente_nome: nomeCliente,
      nota: Math.min(5, Math.max(1, Math.round(dados.nota))),
      comentario: dados.comentario.trim(),
      status: 'aprovada', // entra pré-aprovada para visibilidade imediata, mas moderável pelo admin
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setAvaliacoes(prev => [novaAvaliacao, ...prev]);

    // Notificação para o administrador sobre a nova avaliação
    const notifAdmin: Notificacao = {
      id: Date.now() + 1,
      tipo: 'nova_avaliacao',
      destinatario: 'admin',
      titulo: `Nova Avaliação Recebida (${dados.nota}★)`,
      mensagem: `${nomeCliente} avaliou "${dados.produto_nome}" com ${dados.nota} estrela(s): "${dados.comentario.substring(0, 60)}${dados.comentario.length > 60 ? '...' : ''}"`,
      pedido_id: dados.pedido_id,
      cliente_id: idCliente,
      cliente_nome: nomeCliente,
      lida: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setNotificacoes(prev => [notifAdmin, ...prev]);
    setToastAtual(notifAdmin);
    tocarSomNotificacao();
  };

  const moderarAvaliacao = (id: number, status: StatusAvaliacao) => {
    setAvaliacoes(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const responderAvaliacao = (id: number, resposta: string) => {
    setAvaliacoes(prev => prev.map(a => a.id === id ? { ...a, resposta_admin: resposta.trim() } : a));
  };

  const excluirAvaliacao = (id: number) => {
    setAvaliacoes(prev => prev.filter(a => a.id !== id));
  };

  const obterAvaliacoesProduto = (produtoId: number, apenasAprovadas = true) => {
    return avaliacoes.filter(a => {
      if (a.produto_id !== produtoId) return false;
      if (apenasAprovadas) return a.status === 'aprovada';
      return true;
    });
  };

  const obterMediaAvaliacoes = (produtoId: number) => {
    const aprovadas = avaliacoes.filter(a => a.produto_id === produtoId && a.status === 'aprovada');
    if (aprovadas.length === 0) return { media: 0, total: 0 };
    const soma = aprovadas.reduce((acc, curr) => acc + curr.nota, 0);
    const media = Math.round((soma / aprovadas.length) * 10) / 10;
    return { media, total: aprovadas.length };
  };

  const obterPedidosParaAvaliar = (clienteId: number) => {
    // Pedidos entregues ou retirados do cliente
    return pedidos.filter(p => {
      const matchCliente = p.cliente_id === clienteId;
      const statusOk = p.status === 'ENTREGUE' || p.status === 'RETIRADO';
      if (!matchCliente || !statusOk) return false;

      // Verifica se ainda tem ao menos um item não avaliado neste pedido
      const todosAvaliados = p.itens.every(item => 
        avaliacoes.some(a => a.pedido_id === p.id && a.produto_id === item.produto_id)
      );
      return !todosAvaliados;
    });
  };

  const marcarNotificacaoLida = (id: number) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        atualizarConfig,
        categorias,
        salvarCategoria,
        alternarCategoria,
        produtos,
        salvarProduto,
        alternarStatusProduto,
        excluirOuDesativarProduto,
        clientes,
        clienteAtual,
        identificarPorTelefone,
        cadastrarCliente,
        logoutCliente,
        carrinho,
        adicionarAoCarrinho,
        atualizarQtdCarrinho,
        removerDoCarrinho,
        limparCarrinho,
        tipoEntrega,
        setTipoEntrega,
        enderecoEntrega,
        setEnderecoEntrega,
        pedidos,
        criarPedido,
        atualizarStatusPedido,
        activeView,
        setActiveView,
        produtoModal,
        setProdutoModal,
        ultimoPedidoCriado,
        setUltimoPedidoCriado,
        // Avaliações
        avaliacoes,
        adicionarAvaliacao,
        moderarAvaliacao,
        responderAvaliacao,
        excluirAvaliacao,
        obterAvaliacoesProduto,
        obterMediaAvaliacoes,
        obterPedidosParaAvaliar,
        pedidoParaAvaliar,
        setPedidoParaAvaliar,
        // Notificações
        notificacoes,
        toastAtual,
        setToastAtual,
        marcarNotificacaoLida,
        limparNotificacoes,
        // Autenticação Admin (dujao / 30031936)
        adminAutenticado,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
