import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, User, Shield, Cake, Bell, Star, MessageCircle, Check, X, Sparkles } from 'lucide-react';
import { WhatsAppSMSPreviewModal } from './WhatsAppSMSPreviewModal';
import { Notificacao } from '../types';

export const Header: React.FC = () => {
  const {
    clienteAtual,
    carrinho,
    activeView,
    setActiveView,
    logoutCliente,
    config,
    notificacoes,
    marcarNotificacaoLida,
    limparNotificacoes,
    obterPedidosParaAvaliar,
    setPedidoParaAvaliar
  } = useStore();

  const [painelNotificacoesAberto, setPainelNotificacoesAberto] = useState(false);
  const [notificacaoPreview, setNotificacaoPreview] = useState<Notificacao | null>(null);

  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

  // Notificações não lidas
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // Pedidos que o cliente logado pode avaliar
  const pedidosPendentesAvaliacao = clienteAtual ? obterPedidosParaAvaliar(clienteAtual.id) : [];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E8E2D9] transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => setActiveView('home')} 
            className="text-left group flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#8C482A] flex items-center justify-center font-serif text-lg font-bold border border-[#E8D8C8]">
              <Cake className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#8C482A] block leading-none">
                {config.nome.toUpperCase()}
              </span>
              <span className="text-[10px] tracking-widest text-[#7E7267] uppercase font-sans font-semibold">
                Confeitaria Artesanal
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#7E7267]">
            <button 
              onClick={() => setActiveView('catalogo')}
              className={`transition-colors hover:text-[#8C482A] cursor-pointer ${activeView === 'catalogo' ? 'text-[#8C482A] font-semibold' : ''}`}
            >
              Cardápio
            </button>
            <button 
              onClick={() => setActiveView('home')}
              className={`transition-colors hover:text-[#8C482A] cursor-pointer ${activeView === 'home' ? 'text-[#8C482A] font-semibold' : ''}`}
            >
              Nossa Casa
            </button>
            <button 
              onClick={() => {
                if (clienteAtual) setActiveView('catalogo');
                else setActiveView('identificacao');
              }}
              className="transition-colors hover:text-[#8C482A] cursor-pointer"
            >
              Fazer Pedido
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Alerta de Pedido para Avaliar (se houver) */}
            {pedidosPendentesAvaliacao.length > 0 && (
              <button
                onClick={() => setPedidoParaAvaliar(pedidosPendentesAvaliacao[0])}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF0E6] hover:bg-[#F2ECE4] text-[#8C482A] border border-[#E8D8C8] rounded-lg text-xs font-semibold animate-pulse transition-colors"
                title="Você tem produtos entregues prontos para avaliação!"
              >
                <Star className="w-3.5 h-3.5 fill-[#8C482A]" />
                <span>Avaliar Pedido #{pedidosPendentesAvaliacao[0].id}</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setPainelNotificacoesAberto(!painelNotificacoesAberto)}
                className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border text-xs font-medium transition-colors relative cursor-pointer flex items-center justify-center ${
                  painelNotificacoesAberto
                    ? 'bg-[#8C482A] text-white border-[#8C482A]'
                    : 'bg-[#FAF7F2] text-[#7E7267] border-[#E8E2D9] hover:bg-[#F2ECE4]'
                }`}
                title="Central de Notificações (Status de Pedidos, WhatsApp, SMS)"
                aria-label="Notificações"
              >
                <Bell className="w-4 h-4" />
                {naoLidas > 0 && (
                  <span className="absolute 1.5 top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                    {naoLidas}
                  </span>
                )}
              </button>

              {/* Dropdown / Drawer de Notificações (Mobile Friendly) */}
              {painelNotificacoesAberto && (
                <div 
                  className="fixed inset-x-3 top-18 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl shadow-2xl p-4 z-50 text-[#2D241E] space-y-3 animate-fadeIn max-h-[80vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#8C482A]" />
                      <h4 className="font-serif font-bold text-sm text-[#2D241E]">
                        Central de Notificações
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      {notificacoes.length > 0 && (
                        <button
                          onClick={limparNotificacoes}
                          className="text-[11px] text-[#7E7267] hover:text-[#8C482A] underline cursor-pointer"
                        >
                          Limpar todas
                        </button>
                      )}
                      <button
                        onClick={() => setPainelNotificacoesAberto(false)}
                        className="sm:hidden p-1 text-[#7E7267] hover:text-[#2D241E] rounded-lg"
                        aria-label="Fechar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto space-y-2.5 pr-1 divide-y divide-[#E8E2D9]/60 flex-1">
                    {notificacoes.map((n) => (
                      <div
                        key={n.id}
                        className={`pt-2.5 first:pt-0 space-y-1 transition-all ${
                          !n.lida ? 'bg-amber-50/50 p-2 rounded-xl border border-amber-200/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-serif font-bold text-xs text-[#2D241E]">
                            {n.titulo}
                          </span>
                          <span className="text-[10px] text-[#7E7267] shrink-0 tabular-nums">
                            {n.created_at.split(' ')[1] || n.created_at}
                          </span>
                        </div>
                        <p className="text-xs text-[#7E7267] leading-relaxed">
                          {n.mensagem}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            onClick={() => {
                              setNotificacaoPreview(n);
                              setPainelNotificacoesAberto(false);
                            }}
                            className="min-h-[36px] py-1 text-[#8C482A] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>Ver WhatsApp / SMS / API</span>
                          </button>

                          {!n.lida && (
                            <button
                              onClick={() => marcarNotificacaoLida(n.id)}
                              className="min-h-[36px] px-2 text-[#7E7267] hover:text-[#2D241E] flex items-center gap-0.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Lida</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {notificacoes.length === 0 && (
                      <div className="text-center py-8 text-xs text-[#7E7267]">
                        Nenhuma notificação no momento.
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D9] text-center">
                    <span className="text-[10px] text-[#7E7267] flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#8C482A]" />
                      <span>Notificações sincronizadas em tempo real</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Switch (Desktop & Tablet) */}
            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'catalogo' : 'admin')}
              className={`hidden sm:flex min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium border items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-[#8C482A] text-white border-[#8C482A]'
                  : 'bg-[#FAF7F2] text-[#7E7267] border-[#E8E2D9] hover:bg-[#F2ECE4]'
              }`}
              title="Alternar entre Loja do Cliente e Painel Admin"
            >
              <Shield className="w-4 h-4" />
              <span>{activeView === 'admin' ? 'Voltar à Loja' : 'Admin'}</span>
            </button>

            {/* User Account / Identification (Desktop & Tablet) */}
            <div className="hidden sm:block">
              {clienteAtual ? (
                <div className="flex items-center gap-2 pl-2 border-l border-[#E8E2D9]">
                  <div className="text-right">
                    <span className="text-[11px] text-[#7E7267] block leading-none">Olá,</span>
                    <span className="text-xs font-semibold text-[#2D241E] truncate max-w-[100px] block">
                      {clienteAtual.nome.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={logoutCliente}
                    className="min-h-[44px] px-2 text-[11px] text-[#7E7267] hover:text-[#8C482A] underline cursor-pointer flex items-center"
                    title="Trocar cliente"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveView('identificacao')}
                  className="min-h-[44px] px-3 py-2 text-xs font-medium text-[#2D241E] bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl hover:bg-[#F2ECE4] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#7E7267]" />
                  <span>Entrar</span>
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setActiveView('carrinho')}
              className="min-h-[44px] px-3.5 py-2 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              aria-label="Carrinho de Compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Carrinho</span>
              {totalItens > 0 && (
                <span className="min-w-[20px] h-5 bg-white text-[#8C482A] rounded-full text-[11px] font-bold flex items-center justify-center px-1 tabular-nums">
                  {totalItens}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Modal de Disparo WhatsApp/SMS/Webhook se clicado */}
      {notificacaoPreview && (
        <WhatsAppSMSPreviewModal
          notificacao={notificacaoPreview}
          onClose={() => setNotificacaoPreview(null)}
        />
      )}
    </>
  );
};
