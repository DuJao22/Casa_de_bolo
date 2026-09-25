import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Check, User, Phone, MapPin, Store, Bike, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export const ClientSummary: React.FC = () => {
  const {
    clienteAtual,
    carrinho,
    tipoEntrega,
    enderecoEntrega,
    config,
    criarPedido,
    setActiveView
  } = useStore();

  const [observacaoPedido, setObservacaoPedido] = useState('Favor enviar bem embalado com laço comemorativo e pratinhos descartáveis.');
  const [carregando, setCarregando] = useState(false);

  const subtotal = carrinho.reduce((sum, item) => sum + (Number(item?.subtotal) || (Number(item?.preco_unitario || 0) * Number(item?.quantidade || 1)) || 0), 0);
  const taxaEntrega = tipoEntrega === 'entrega' ? (Number(config?.taxa_entrega) || 0) : 0;
  const total = subtotal + taxaEntrega;

  const handleConfirmar = () => {
    if (carregando) return;
    setCarregando(true);

    try {
      criarPedido(observacaoPedido);
      setActiveView('confirmado');
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar pedido.');
      setCarregando(false);
    }
  };

  if (!clienteAtual || carrinho.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#7E7267]">Dados incompletos para o resumo.</p>
        <button
          onClick={() => setActiveView('catalogo')}
          className="mt-4 px-4 py-2 bg-[#8C482A] text-white rounded-lg text-xs"
        >
          Voltar ao cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
      
      <button
        onClick={() => setActiveView('entrega')}
        className="min-h-[44px] text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Alterar forma de recebimento</span>
      </button>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E]">
          Resumo do seu Pedido
        </h1>
        <p className="text-xs sm:text-sm text-[#7E7267] mt-1">
          Confira todos os detalhes antes de confirmar com a confeitaria.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E8E2D9]">
        
        {/* Identificação do Cliente */}
        <div className="p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C482A]">
            <User className="w-4 h-4" />
            <span>Dados do Cliente</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-base text-[#2D241E]">
              {clienteAtual.nome}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#7E7267] flex items-center gap-1 tabular-nums">
              <Phone className="w-3.5 h-3.5" />
              <span>{clienteAtual.telefone}</span>
            </span>
          </div>
        </div>

        {/* Forma de Recebimento */}
        <div className="p-4 sm:p-5 space-y-2 bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C482A]">
            {tipoEntrega === 'entrega' ? <Bike className="w-4 h-4" /> : <Store className="w-4 h-4" />}
            <span>Recebimento</span>
          </div>

          <div className="font-bold text-sm text-[#2D241E]">
            {tipoEntrega === 'entrega' ? '🛵 Receber em Casa (Entrega)' : '🏪 Retirada no Balcão da Loja'}
          </div>

          {tipoEntrega === 'entrega' ? (
            <p className="text-xs text-[#7E7267] flex items-start gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#8C482A]" />
              <span>{enderecoEntrega}</span>
            </p>
          ) : (
            <p className="text-xs text-[#7E7267]">
              Endereço da loja: {config.endereco}
            </p>
          )}
        </div>

        {/* Itens do Pedido */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7E7267]">
            Itens Selecionados ({carrinho.length})
          </div>

          <div className="space-y-2.5">
            {carrinho.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-[#2D241E]">{item.quantidade}x</span>{' '}
                  <span className="font-medium text-[#2D241E]">{item.nome}</span>
                  {item.observacao && (
                    <p className="text-[11px] text-[#8C482A] italic">
                      Obs: "{item.observacao}"
                    </p>
                  )}
                </div>
                <span className="font-bold text-[#2D241E] tabular-nums whitespace-nowrap">
                  R$ {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Valores */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#7E7267]">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-[#2D241E]">
              R$ {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-[#7E7267]">
            <span>Taxa de Entrega</span>
            <span className="tabular-nums font-medium text-[#2D241E]">
              {tipoEntrega === 'entrega' ? `R$ ${formatCurrency(taxaEntrega)}` : <span className="text-emerald-700 font-bold">Grátis</span>}
            </span>
          </div>

          <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
            <span className="font-serif font-bold text-base text-[#2D241E]">
              Total a pagar
            </span>
            <span className="font-sans font-bold text-2xl text-[#8C482A] tabular-nums">
              R$ {formatCurrency(total)}
            </span>
          </div>
        </div>

      </div>

      {/* Observação Geral do Pedido */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-4 sm:p-5 space-y-2">
        <label htmlFor="obs-geral" className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#8C482A]" />
          <span>Observações gerais do pedido (opcional)</span>
        </label>
        <textarea
          id="obs-geral"
          rows={2}
          value={observacaoPedido}
          onChange={(e) => setObservacaoPedido(e.target.value)}
          placeholder="Ex: Tocar a campainha 2 vezes, troco para R$ 100, etc."
          className="w-full p-3 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] placeholder-[#7E7267]/60 focus:bg-white focus:border-[#8C482A] focus:outline-none"
        />
      </div>

      {/* Botão Final de Confirmação (Mobile Thumb Anchor) */}
      <div className="sticky bottom-20 md:static z-20">
        <button
          onClick={handleConfirmar}
          disabled={carregando}
          className="w-full min-h-[52px] py-3.5 bg-[#8C482A] hover:bg-[#73371D] disabled:opacity-50 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#8C482A]/20 transition-transform active:scale-98 cursor-pointer"
        >
          <Check className="w-5 h-5" />
          <span>{carregando ? 'Confirmando...' : 'Confirmar Pedido Agora'}</span>
        </button>
      </div>

    </div>
  );
};
