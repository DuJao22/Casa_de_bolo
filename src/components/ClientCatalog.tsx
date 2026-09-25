import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Produto } from '../types';
import { Search, ShoppingBag, Plus, Minus, X, Check, Star, MessageSquare } from 'lucide-react';

export const ClientCatalog: React.FC = () => {
  const {
    categorias,
    produtos,
    carrinho,
    adicionarAoCarrinho,
    produtoModal,
    setProdutoModal,
    setActiveView,
    obterMediaAvaliacoes,
    obterAvaliacoesProduto,
    clienteAtual,
    obterPedidosParaAvaliar,
    setPedidoParaAvaliar
  } = useStore();

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [quantidadeModal, setQuantidadeModal] = useState(1);
  const [observacaoModal, setObservacaoModal] = useState('');
  const [feedbackAdicionado, setFeedbackAdicionado] = useState(false);

  // Categorias ativas
  const categoriasAtivas = categorias.filter(c => c.ativo).sort((a, b) => a.ordem - b.ordem);

  // Filtro de produtos
  const produtosFiltrados = produtos.filter(prod => {
    if (!prod.ativo) return false;
    if (categoriaSelecionada && prod.categoria_id !== categoriaSelecionada) return false;
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      return prod.nome.toLowerCase().includes(termo) || prod.descricao.toLowerCase().includes(termo);
    }
    return true;
  });

  const abrirModal = (prod: Produto) => {
    setProdutoModal(prod);
    setQuantidadeModal(1);
    setObservacaoModal('');
    setFeedbackAdicionado(false);
  };

  const fecharModal = () => {
    setProdutoModal(null);
    setFeedbackAdicionado(false);
  };

  const handleConfirmarAdicionar = () => {
    if (!produtoModal) return;
    adicionarAoCarrinho(produtoModal, quantidadeModal, observacaoModal);
    setFeedbackAdicionado(true);
    setTimeout(() => {
      fecharModal();
    }, 600);
  };

  const totalItensCarrinho = carrinho.reduce((sum, i) => sum + i.quantidade, 0);
  const totalValorCarrinho = carrinho.reduce((sum, i) => sum + i.subtotal, 0);

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header do Cardápio & Busca */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E]">
              Nosso Cardápio Artesanal
            </h1>
            <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
              Receitas frescas preparadas com carinho e coberturas generosas.
            </p>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7E7267]" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar bolo ou doce..."
              className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] placeholder-[#7E7267]/60 focus:outline-none focus:border-[#8C482A]"
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7E7267] hover:text-[#2D241E]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categorias em Scroll Horizontal (Mobile First) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setCategoriaSelecionada(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              categoriaSelecionada === null
                ? 'bg-[#8C482A] text-white border-[#8C482A] shadow-xs'
                : 'bg-[#FFFFFF] text-[#7E7267] border-[#E8E2D9] hover:bg-[#FAF7F2]'
            }`}
          >
            ⭐ Todos os Produtos
          </button>

          {categoriasAtivas.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSelecionada(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                categoriaSelecionada === cat.id
                  ? 'bg-[#8C482A] text-white border-[#8C482A] shadow-xs'
                  : 'bg-[#FFFFFF] text-[#7E7267] border-[#E8E2D9] hover:bg-[#FAF7F2]'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {produtosFiltrados.map(prod => {
          const categoria = categorias.find(c => c.id === prod.categoria_id);
          return (
            <div
              key={prod.id}
              onClick={() => abrirModal(prod)}
              className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-[#8C482A]/50 hover:shadow-md transition-all"
            >
              {/* Foto do Bolo */}
              <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
                <img
                  src={prod.imagem}
                  alt={prod.nome}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {prod.destaque && (
                  <span className="absolute top-2.5 left-2.5 bg-[#2D241E]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Mais Pedido
                  </span>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-[#8C482A] uppercase tracking-wider block">
                    {categoria?.nome || 'Confeitaria'}
                  </span>
                  
                  {/* Rating Médio no Card */}
                  {(() => {
                    const rating = obterMediaAvaliacoes(prod.id);
                    if (rating.total > 0) {
                      return (
                        <div className="flex items-center gap-1 text-xs font-bold text-[#2D241E] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D9]">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="tabular-nums">{rating.media.toFixed(1)}</span>
                          <span className="text-[10px] text-[#7E7267] font-normal">({rating.total})</span>
                        </div>
                      );
                    }
                    return (
                      <span className="text-[10px] text-[#7E7267] italic">Novo</span>
                    );
                  })()}
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D241E] group-hover:text-[#8C482A] transition-colors leading-snug line-clamp-1">
                  {prod.nome}
                </h3>

                <p className="text-xs text-[#7E7267] mt-1 line-clamp-2 leading-relaxed flex-1">
                  {prod.descricao}
                </p>

                {/* Preço e Botão Adicionar */}
                <div className="mt-4 pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                  <div className="font-sans font-bold text-[#8C482A] text-lg tabular-nums">
                    R$ {prod.preco.toFixed(2).replace('.', ',')}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModal(prod);
                    }}
                    className="px-3.5 py-1.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-lg text-xs font-semibold transition-transform active:scale-95"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="text-center py-16 bg-[#FFFFFF] border border-dashed border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-sm font-semibold text-[#2D241E]">Nenhum produto encontrado</p>
          <p className="text-xs text-[#7E7267] mt-1">Tente buscar por outro termo ou selecione outra categoria.</p>
          <button
            onClick={() => { setCategoriaSelecionada(null); setBusca(''); }}
            className="mt-4 px-4 py-2 bg-[#FAF7F2] text-[#8C482A] rounded-lg text-xs font-semibold border border-[#E8E2D9]"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Modal / Bottom Sheet Responsivo do Produto (Mobile First) */}
      {produtoModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={fecharModal}
        >
          <div 
            className="bg-[#FFFFFF] rounded-t-3xl sm:rounded-2xl border border-[#E8E2D9] w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slideUp sm:animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden w-12 h-1.5 bg-[#D5C9BD] rounded-full mx-auto my-2.5 shrink-0" />

            {/* Botão Fechar com touch hitbox >= 44x44px */}
            <button
              onClick={fecharModal}
              className="absolute top-2.5 sm:top-3 right-3 z-30 min-w-[44px] min-h-[44px] rounded-full bg-white/90 text-[#2D241E] flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagem Grande */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-[#FAF7F2] shrink-0">
              <img
                src={produtoModal.imagem}
                alt={produtoModal.nome}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Conteúdo do Modal com Scroll */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 overscroll-contain">
              <div>
                <span className="text-[11px] font-bold text-[#8C482A] uppercase tracking-wider">
                  {categorias.find(c => c.id === produtoModal.categoria_id)?.nome}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D241E] mt-0.5">
                  {produtoModal.nome}
                </h2>
                <p className="text-xs sm:text-sm text-[#7E7267] mt-1.5 leading-relaxed">
                  {produtoModal.descricao}
                </p>
              </div>

              <div className="py-2.5 border-y border-[#E8E2D9] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7E7267] uppercase tracking-wider">
                  Preço unitário
                </span>
                <span className="font-sans font-bold text-[#8C482A] text-xl tabular-nums">
                  R$ {produtoModal.preco.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-2">
                  Quantidade
                </label>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center border border-[#E8E2D9] rounded-xl bg-[#FAF7F2] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantidadeModal(Math.max(1, quantidadeModal - 1))}
                      className="min-w-[40px] min-h-[40px] rounded-lg bg-white border border-[#E8E2D9] flex items-center justify-center text-[#2D241E] hover:bg-[#FAF7F2] active:scale-95 cursor-pointer"
                      aria-label="Diminuir"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-bold text-base tabular-nums">
                      {quantidadeModal}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantidadeModal(quantidadeModal + 1)}
                      className="min-w-[40px] min-h-[40px] rounded-lg bg-white border border-[#E8E2D9] flex items-center justify-center text-[#2D241E] hover:bg-[#FAF7F2] active:scale-95 cursor-pointer"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs sm:text-sm text-[#7E7267]">
                    Subtotal: <strong className="text-[#8C482A] text-base tabular-nums">R$ {(produtoModal.preco * quantidadeModal).toFixed(2).replace('.', ',')}</strong>
                  </span>
                </div>
              </div>

              {/* Observação Opcional */}
              <div>
                <label htmlFor="modal-obs" className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-1.5">
                  Alguma observação? (Opcional)
                </label>
                <input
                  id="modal-obs"
                  type="text"
                  value={observacaoModal}
                  onChange={(e) => setObservacaoModal(e.target.value)}
                  placeholder="Ex: Mandar com vela de aniversário, sem raspas de chocolate..."
                  className="w-full px-3.5 py-3 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-base sm:text-sm text-[#2D241E] placeholder-[#7E7267]/60 focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              {/* Seção de Avaliações do Produto */}
              {(() => {
                const rating = obterMediaAvaliacoes(produtoModal.id);
                const avaliacoesDoProduto = obterAvaliacoesProduto(produtoModal.id, true);
                
                // Checa se o cliente logado tem algum pedido entregue com este produto
                const pedidosParaAvaliar = clienteAtual ? obterPedidosParaAvaliar(clienteAtual.id) : [];
                const pedidoComEsseItem = pedidosParaAvaliar.find(p => 
                  p.itens.some(item => item.produto_id === produtoModal.id)
                );

                return (
                  <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#2D241E] flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Avaliações dos Clientes</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {rating.total > 0 ? (
                            <>
                              <span className="font-sans font-bold text-sm text-[#2D241E] tabular-nums">
                                {rating.media.toFixed(1)} de 5.0
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${s <= Math.round(rating.media) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-[#7E7267]">
                                ({rating.total} {rating.total === 1 ? 'avaliação' : 'avaliações'})
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-[#7E7267] italic">
                              Ainda não possui avaliações. Seja o primeiro a saborear!
                            </span>
                          )}
                        </div>
                      </div>

                      {pedidoComEsseItem && (
                        <button
                          type="button"
                          onClick={() => {
                            fecharModal();
                            setPedidoParaAvaliar(pedidoComEsseItem);
                          }}
                          className="min-h-[44px] px-3 py-1.5 bg-[#FAF0E6] hover:bg-[#F2ECE4] text-[#8C482A] border border-[#E8D8C8] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Avaliar Produto</span>
                        </button>
                      )}
                    </div>

                    {/* Lista de Avaliações Aprovadas */}
                    {avaliacoesDoProduto.length > 0 && (
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {avaliacoesDoProduto.map((av) => (
                          <div
                            key={av.id}
                            className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#2D241E]">
                                {av.cliente_nome}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-2.5 h-2.5 ${s <= av.nota ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-[10px] text-[#7E7267] ml-1.5 tabular-nums">
                                  {av.created_at.split(' ')[0]}
                                </span>
                              </div>
                            </div>

                            <p className="text-[#2D241E] leading-relaxed">
                              "{av.comentario}"
                            </p>

                            {av.resposta_admin && (
                              <div className="mt-1.5 p-2 bg-white rounded-lg border border-[#E8D8C8] text-[11px]">
                                <span className="font-bold text-[#8C482A] block flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Resposta da Casa de Bolos:</span>
                                </span>
                                <p className="text-[#2D241E] mt-0.5">{av.resposta_admin}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

            {/* Barra de Ação Fixa Inferior no Modal (Mobile Thumb Anchor) */}
            <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D9] shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pb-safe sm:pb-5">
              <button
                type="button"
                onClick={handleConfirmarAdicionar}
                className={`w-full min-h-[48px] py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer ${
                  feedbackAdicionado
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#8C482A] hover:bg-[#73371D] text-white'
                }`}
              >
                {feedbackAdicionado ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Adicionado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Adicionar ao pedido · R$ {(produtoModal.preco * quantidadeModal).toFixed(2).replace('.', ',')}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Bottom Bar no Mobile (acima do Bottom Nav) */}
      {totalItensCarrinho > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-3.5 right-3.5 z-30 max-w-md mx-auto animate-slideUp">
          <button
            onClick={() => setActiveView('carrinho')}
            className="w-full min-h-[48px] py-3 px-4 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-2xl shadow-xl flex items-center justify-between font-semibold text-sm transition-transform active:scale-98 border border-[#FAF0E6]/20 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white text-[#8C482A] text-xs font-bold flex items-center justify-center shadow-xs">
                {totalItensCarrinho}
              </div>
              <span>Ver Pedido</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tabular-nums">R$ {totalValorCarrinho.toFixed(2).replace('.', ',')}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg">Avançar →</span>
            </div>
          </button>
        </div>
      )}

    </div>
  );
};
