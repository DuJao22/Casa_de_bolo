import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Clock, Heart, Award, Star } from 'lucide-react';
import { formatCurrency, formatRating } from '../utils/format';

export const ClientHome: React.FC = () => {
  const { clienteAtual, setActiveView, produtos, setProdutoModal, obterMediaAvaliacoes, carrinho } = useStore();

  const destaques = produtos.filter(p => p.destaque && p.ativo).slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-[#E8E2D9] bg-[#FFFFFF] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C482A] bg-[#FAF0E6] px-3 py-1 rounded-full border border-[#E8D8C8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confeitaria Artesanal Tradicional</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2D241E] leading-tight text-balance">
              Casa de Bolos
            </h1>

            <p className="text-base sm:text-lg text-[#7E7267] leading-relaxed max-w-xl">
              Bolos feitos com carinho para deixar seu dia mais especial. Receitas artesanais que saem quentinhas do forno diariamente com coberturas aveludadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  if (clienteAtual) {
                    setActiveView('catalogo');
                  } else {
                    setActiveView('identificacao');
                  }
                }}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
              >
                <span>{clienteAtual ? 'Continuar meu pedido' : 'Fazer meu pedido'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('catalogo')}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-transparent hover:bg-[#FAF7F2] text-[#2D241E] border border-[#E8E2D9] rounded-xl font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer"
              >
                Ver cardápio completo
              </button>
            </div>

            {/* Banner de Preenchimento Automático Render */}
            {clienteAtual && (
              <div className="bg-[#FAF0E6] border border-[#E8D8C8] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="text-[#2D241E]">
                    ⚡ Preenchimento automático ativo: <strong>{clienteAtual.nome}</strong> ({clienteAtual.telefone})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('carrinho')}
                    className="font-bold text-[#8C482A] hover:underline cursor-pointer"
                  >
                    Ver Carrinho ({carrinho.reduce((acc, i) => acc + i.quantidade, 0)} itens) →
                  </button>
                </div>
              </div>
            )}

            {/* Quick trust proofs */}
            <div className="pt-4 border-t border-[#E8E2D9] flex flex-wrap gap-y-2 gap-x-6 text-xs text-[#7E7267]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8C482A]" />
                <span>Assados todos os dias</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#8C482A]" />
                <span>Massa leve e fofinha</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#8C482A]" />
                <span>Ingredientes de verdade</span>
              </span>
            </div>
          </div>

          <div className="relative lg:col-span-5 h-64 lg:h-full min-h-[300px] overflow-hidden bg-[#FAF0E6]">
            <img
              src="/src/assets/images/hero_confeitaria_1790270043414.jpg"
              alt="Balcão da Casa de Bolos"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
          </div>

        </div>
      </section>

      {/* Featured Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C482A]">
              Favoritos dos Clientes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-1">
              Os Mais Pedidos da Semana
            </h2>
          </div>
          <button
            onClick={() => setActiveView('catalogo')}
            className="text-xs sm:text-sm font-semibold text-[#8C482A] hover:underline flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destaques.map(produto => {
            const { media, total } = obterMediaAvaliacoes(produto.id);
            return (
              <div
                key={produto.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D9] overflow-hidden flex flex-col hover:border-[#8C482A]/40 transition-all hover:shadow-md group cursor-pointer"
                onClick={() => setProdutoModal(produto)}
              >
                <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#2D241E]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                    Destaque
                  </div>

                  {total > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 text-[11px] font-bold text-[#2D241E]">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{formatRating(media)}</span>
                      <span className="text-[#7E7267] font-normal">({total})</span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#2D241E] group-hover:text-[#8C482A] transition-colors line-clamp-1">
                    {produto.nome}
                  </h3>
                  <p className="text-xs text-[#7E7267] mt-1 line-clamp-2 leading-relaxed">
                    {produto.descricao}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7E7267] block">A partir de</span>
                      <span className="font-sans font-bold text-[#8C482A] text-lg tabular-nums">
                        R$ {formatCurrency(produto.preco)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProdutoModal(produto);
                      }}
                      className="min-h-[44px] px-4 py-2 bg-[#FAF0E6] hover:bg-[#8C482A] text-[#8C482A] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Adicionar +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Como Funciona o Atendimento */}
      <section className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-6 sm:p-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C482A]">Praticidade</span>
          <h2 className="font-serif text-2xl font-bold text-[#2D241E]">
            Como pedir na Casa de Bolos
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7267]">
            Tudo pelo seu celular, sem complicação e sem necessidade de senhas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]/70 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#8C482A] text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D241E]">Identificação por WhatsApp</h3>
            <p className="text-xs text-[#7E7267] leading-relaxed">
              Basta informar seu número. Se já pediu antes, recuperamos seu cadastro imediatamente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]/70 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#8C482A] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D241E]">Escolha suas delícias</h3>
            <p className="text-xs text-[#7E7267] leading-relaxed">
              Navegue pelo cardápio, adicione bolos artesanais, doces e personalize com suas observações.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9]/70 space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#8C482A] text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D241E]">Retire ou Receba em Casa</h3>
            <p className="text-xs text-[#7E7267] leading-relaxed">
              Retire quentinho no balcão sem taxa, ou receba com rapidez e acompanhe cada etapa do preparo.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
