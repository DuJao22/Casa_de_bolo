import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, X, Check, MessageSquare, Cake, Sparkles } from 'lucide-react';

export const ReviewOrderModal: React.FC = () => {
  const { pedidoParaAvaliar, setPedidoParaAvaliar, produtos, avaliacoes, adicionarAvaliacao } = useStore();

  const [produtoIndex, setProdutoIndex] = useState(0);
  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState<number | null>(null);
  const [comentario, setComentario] = useState('Bolo maravilhoso, super fofinho e com recheio bem generoso. Entrega rápida e excelente atendimento!');
  const [sucessoFeedback, setSucessoFeedback] = useState(false);

  if (!pedidoParaAvaliar) return null;

  const itens = pedidoParaAvaliar.itens;
  const itemAtual = itens[produtoIndex] || itens[0];

  const produtoReal = produtos.find(p => p.id === itemAtual.produto_id);

  // Checa se este item já foi avaliado neste pedido
  const avaliacaoExistente = avaliacoes.find(
    a => a.pedido_id === pedidoParaAvaliar.id && a.produto_id === itemAtual.produto_id
  );

  const getDescricaoNota = (stars: number) => {
    switch (stars) {
      case 1: return 'Péssimo / Não gostei';
      case 2: return 'Regular / Pode melhorar';
      case 3: return 'Bom / Atendeu às expectativas';
      case 4: return 'Muito Gostoso! / Bem fresquinho';
      case 5: return 'Espetacular! / Amor à primeira mordida 🎂';
      default: return '';
    }
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    adicionarAvaliacao({
      produto_id: itemAtual.produto_id,
      produto_nome: itemAtual.produto_nome,
      pedido_id: pedidoParaAvaliar.id,
      nota: nota,
      comentario: comentario.trim()
    });

    setSucessoFeedback(true);
    setTimeout(() => {
      setSucessoFeedback(false);
      setComentario('');
      setNota(5);
      // Avança para o próximo item não avaliado se houver
      if (produtoIndex < itens.length - 1) {
        setProdutoIndex(produtoIndex + 1);
      } else {
        setPedidoParaAvaliar(null);
      }
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={() => setPedidoParaAvaliar(null)}
    >
      <div 
        className="bg-[#FFFFFF] rounded-t-3xl sm:rounded-2xl border border-[#E8E2D9] w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-slideUp sm:animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-[#D5C9BD] rounded-full mx-auto my-2.5 shrink-0" />

        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D9] bg-[#FAF7F2] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C482A] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#E8D8C8]">
                Avaliação de Experiência
              </span>
              <span className="text-xs text-[#7E7267]">Pedido #{pedidoParaAvaliar.id}</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D241E] mt-1">
              Como estavam suas delícias?
            </h3>
          </div>

          <button
            onClick={() => setPedidoParaAvaliar(null)}
            className="min-w-[44px] min-h-[44px] rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#7E7267] hover:text-[#2D241E] cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navegação entre múltiplos produtos se o pedido tiver mais de 1 */}
        {itens.length > 1 && (
          <div className="px-5 py-2.5 bg-[#FAF0E6]/50 border-b border-[#E8D8C8] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-[#8C482A] whitespace-nowrap">
              Itens do Pedido:
            </span>
            {itens.map((it, idx) => {
              const jaAvaliado = avaliacoes.some(a => a.pedido_id === pedidoParaAvaliar.id && a.produto_id === it.produto_id);
              return (
                <button
                  key={it.id}
                  onClick={() => {
                    setProdutoIndex(idx);
                    setComentario('');
                    setNota(5);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                    produtoIndex === idx
                      ? 'bg-[#8C482A] text-white shadow-xs'
                      : 'bg-white text-[#7E7267] border border-[#E8E2D9] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{it.produto_nome.split(' ')[0]}</span>
                  {jaAvaliado && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Conteúdo com Scroll */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Card do Produto Sendo Avaliado */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-white overflow-hidden shrink-0 border border-[#E8E2D9]">
              {produtoReal?.imagem ? (
                <img
                  src={produtoReal.imagem}
                  alt={itemAtual.produto_nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8C482A]">
                  <Cake className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <span className="text-[11px] text-[#8C482A] font-semibold uppercase tracking-wider block">
                Item {produtoIndex + 1} de {itens.length}
              </span>
              <h4 className="font-serif font-bold text-sm text-[#2D241E]">
                {itemAtual.produto_nome}
              </h4>
              <p className="text-xs text-[#7E7267]">
                Quantidade consumida: {itemAtual.quantidade} un
              </p>
            </div>
          </div>

          {avaliacaoExistente ? (
            /* Já Avaliado */
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-emerald-900">
                Você já avaliou este produto!
              </h4>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= avaliacaoExistente.nota ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-emerald-800 italic">
                "{avaliacaoExistente.comentario}"
              </p>
              {avaliacaoExistente.resposta_admin && (
                <div className="mt-3 p-2.5 bg-white rounded-lg border border-emerald-200 text-left text-xs">
                  <span className="font-bold text-[#8C482A] block">Resposta da Casa de Bolos:</span>
                  <p className="text-[#2D241E] mt-0.5">{avaliacaoExistente.resposta_admin}</p>
                </div>
              )}
              {produtoIndex < itens.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setProdutoIndex(produtoIndex + 1)}
                  className="mt-3 px-4 py-2 bg-[#8C482A] text-white rounded-lg text-xs font-semibold"
                >
                  Avaliar Próximo Item →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPedidoParaAvaliar(null)}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Concluir Avaliações
                </button>
              )}
            </div>
          ) : (
            /* Formulário de Avaliação */
            <form onSubmit={handleEnviar} className="space-y-4">
              
              {/* Estrelas Interativas */}
              <div className="text-center space-y-1.5 py-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7E7267]">
                  Sua Nota (1 a 5 estrelas)
                </label>
                
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((estrela) => {
                    const ativo = (hoverNota !== null ? hoverNota : nota) >= estrela;
                    return (
                      <button
                        type="button"
                        key={estrela}
                        onMouseEnter={() => setHoverNota(estrela)}
                        onMouseLeave={() => setHoverNota(null)}
                        onClick={() => setNota(estrela)}
                        className="min-w-[48px] min-h-[48px] p-2 transition-transform hover:scale-110 active:scale-125 focus:outline-none cursor-pointer flex items-center justify-center"
                        aria-label={`${estrela} estrelas`}
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            ativo
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="h-5">
                  <span className="text-xs font-semibold text-[#8C482A] transition-all">
                    {getDescricaoNota(hoverNota !== null ? hoverNota : nota)}
                  </span>
                </div>
              </div>

              {/* Comentário */}
              <div className="space-y-1.5">
                <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] flex items-center justify-between">
                  <span>Seu Comentário</span>
                  <span className="text-[11px] text-[#7E7267] font-normal">Mínimo 5 letras</span>
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Ex: O bolo estava incrivelmente macio e o brigadeiro no ponto ideal. Chegou perfeito!"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] placeholder-[#7E7267]/60 focus:bg-white focus:border-[#8C482A] focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={comentario.trim().length < 5 || sucessoFeedback}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 ${
                  sucessoFeedback
                    ? 'bg-emerald-600 text-white'
                    : comentario.trim().length < 5
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#8C482A] hover:bg-[#73371D] text-white'
                }`}
              >
                {sucessoFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Avaliação Publicada com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publicar Avaliação ({nota} Estrelas)</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
