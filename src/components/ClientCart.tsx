import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export const ClientCart: React.FC = () => {
  const {
    carrinho,
    atualizarQtdCarrinho,
    removerDoCarrinho,
    setActiveView,
    tipoEntrega,
    config,
    clienteAtual
  } = useStore();

  const subtotal = carrinho.reduce((sum, item) => sum + item.subtotal, 0);
  const taxaEntrega = tipoEntrega === 'entrega' ? config.taxa_entrega : 0;
  const total = subtotal + taxaEntrega;

  const handleContinuar = () => {
    if (!clienteAtual) {
      setActiveView('identificacao');
    } else {
      setActiveView('entrega');
    }
  };

  if (carrinho.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#8C482A] flex items-center justify-center mx-auto text-2xl">
            🧺
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D241E]">
            Seu carrinho está vazio
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7267] max-w-xs mx-auto">
            Que tal escolher um bolo quentinho feito com carinho para adoçar seu dia?
          </p>
          <button
            onClick={() => setActiveView('catalogo')}
            className="w-full py-3 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl font-semibold text-sm transition-transform active:scale-98"
          >
            Ver nosso cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header do Carrinho */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('catalogo')}
          className="text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao cardápio</span>
        </button>
        <span className="text-xs text-[#7E7267]">
          {carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'} no pedido
        </span>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm">
        
        <div className="p-4 sm:p-5 border-b border-[#E8E2D9] flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#8C482A]" />
          <h1 className="font-serif text-lg font-bold text-[#2D241E]">
            Itens no seu Carrinho
          </h1>
        </div>

        {/* Lista de Itens */}
        <div className="divide-y divide-[#E8E2D9]">
          {carrinho.map((item, index) => (
            <div key={`${item.produto_id}-${index}`} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-start gap-3.5 flex-1">
                {item.imagem && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E2D9]">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D241E]">
                    {item.nome}
                  </h3>
                  <div className="text-xs text-[#7E7267] tabular-nums">
                    Unitário: R$ {item.preco_unitario.toFixed(2).replace('.', ',')}
                  </div>
                  {item.observacao && (
                    <p className="text-[11px] text-[#8C482A] bg-[#FAF0E6] px-2 py-0.5 rounded italic inline-block mt-1">
                      Obs: "{item.observacao}"
                    </p>
                  )}
                </div>
              </div>

              {/* Controles de Quantidade e Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E2D9]/60">
                
                {/* Stepper com hitboxes >= 44x44px */}
                <div className="flex items-center border border-[#E8E2D9] rounded-xl bg-[#FAF7F2] p-1">
                  <button
                    onClick={() => atualizarQtdCarrinho(index, -1)}
                    className="min-w-[40px] min-h-[40px] rounded-lg bg-white border border-[#E8E2D9] flex items-center justify-center text-[#2D241E] hover:bg-[#FAF7F2] active:scale-95 cursor-pointer"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center font-bold text-sm tabular-nums">
                    {item.quantidade}
                  </span>
                  <button
                    onClick={() => atualizarQtdCarrinho(index, 1)}
                    className="min-w-[40px] min-h-[40px] rounded-lg bg-white border border-[#E8E2D9] flex items-center justify-center text-[#2D241E] hover:bg-[#FAF7F2] active:scale-95 cursor-pointer"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="font-sans font-bold text-base text-[#8C482A] tabular-nums block">
                    R$ {item.subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Remover com hitbox >= 44x44px */}
                <button
                  onClick={() => removerDoCarrinho(index)}
                  className="min-w-[44px] min-h-[44px] text-[#7E7267] hover:text-red-600 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remover item"
                  aria-label="Remover item do carrinho"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Resumo de Valores */}
        <div className="bg-[#FAF7F2] p-5 border-t border-[#E8E2D9] space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#7E7267]">
            <span>Subtotal dos produtos</span>
            <span className="font-medium text-[#2D241E] tabular-nums">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-[#7E7267]">
            <span>Forma de Recebimento</span>
            <span className="text-[11px] font-medium text-[#8C482A]">
              {tipoEntrega === 'entrega' ? `Entrega (R$ ${taxaEntrega.toFixed(2).replace('.', ',')})` : 'Retirada na loja (Grátis)'}
            </span>
          </div>

          <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
            <span className="font-serif font-bold text-base text-[#2D241E]">
              Total estimado
            </span>
            <span className="font-sans font-bold text-xl text-[#8C482A] tabular-nums">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

      </div>

      {/* Botão de Continuar (Mobile Thumb Anchor) */}
      <div className="sticky bottom-20 md:static z-20">
        <button
          onClick={handleContinuar}
          className="w-full min-h-[50px] py-3.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#8C482A]/20 transition-transform active:scale-98 cursor-pointer"
        >
          <span>Continuar pedido</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
