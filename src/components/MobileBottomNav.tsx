import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Cake, ShoppingBag, User, Shield, Star } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    carrinho,
    clienteAtual,
    obterPedidosParaAvaliar,
    setPedidoParaAvaliar
  } = useStore();

  const totalItens = carrinho.reduce((sum, item) => sum + (Number(item?.quantidade) || 0), 0);
  const subtotal = carrinho.reduce((sum, item) => sum + (Number(item?.subtotal) || (Number(item?.preco_unitario || 0) * Number(item?.quantidade || 1)) || 0), 0);

  // Checa se cliente tem pedido para avaliar
  const pedidosParaAvaliar = clienteAtual ? obterPedidosParaAvaliar(clienteAtual.id) : [];

  return (
    <nav 
      aria-label="Navegação Principal Mobile" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E8E2D9] pb-safe transition-all shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        
        {/* Tab 1: Início */}
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative cursor-pointer ${
            activeView === 'home'
              ? 'text-[#8C482A] font-bold'
              : 'text-[#7E7267] hover:text-[#2D241E]'
          }`}
          aria-label="Página Inicial"
        >
          <Home className={`w-5 h-5 transition-transform ${activeView === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 leading-none">Início</span>
          {activeView === 'home' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#8C482A]" />
          )}
        </button>

        {/* Tab 2: Cardápio */}
        <button
          onClick={() => setActiveView('catalogo')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative cursor-pointer ${
            activeView === 'catalogo'
              ? 'text-[#8C482A] font-bold'
              : 'text-[#7E7267] hover:text-[#2D241E]'
          }`}
          aria-label="Cardápio de Bolos"
        >
          <Cake className={`w-5 h-5 transition-transform ${activeView === 'catalogo' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 leading-none">Cardápio</span>
          {activeView === 'catalogo' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#8C482A]" />
          )}
        </button>

        {/* Tab 3: Carrinho (Destaque Central) */}
        <button
          onClick={() => setActiveView('carrinho')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative cursor-pointer ${
            activeView === 'carrinho' || activeView === 'entrega' || activeView === 'resumo' || activeView === 'confirmado'
              ? 'text-[#8C482A] font-bold'
              : 'text-[#7E7267] hover:text-[#2D241E]'
          }`}
          aria-label={`Carrinho com ${totalItens} itens`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 transition-transform ${activeView === 'carrinho' ? 'scale-110' : ''}`} />
            {totalItens > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-[#8C482A] text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1 tabular-nums animate-scaleIn shadow-xs">
                {totalItens}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            {totalItens > 0 ? `R$ ${Math.round(subtotal || 0)}` : 'Carrinho'}
          </span>
          {(activeView === 'carrinho' || activeView === 'entrega' || activeView === 'resumo') && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#8C482A]" />
          )}
        </button>

        {/* Tab 4: Minha Conta ou Avaliar */}
        {pedidosParaAvaliar.length > 0 ? (
          <button
            onClick={() => setPedidoParaAvaliar(pedidosParaAvaliar[0])}
            className="flex flex-col items-center justify-center min-h-[48px] py-1 text-amber-600 font-bold relative cursor-pointer animate-pulse"
            aria-label="Avaliar Pedido Pendente"
          >
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span className="text-[10px] tracking-tight mt-1 leading-none">Avaliar</span>
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (clienteAtual) {
                // Alterna para identificação ou exibe tela do cliente
                setActiveView('identificacao');
              } else {
                setActiveView('identificacao');
              }
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative cursor-pointer ${
              activeView === 'identificacao' || activeView === 'cadastro'
                ? 'text-[#8C482A] font-bold'
                : 'text-[#7E7267] hover:text-[#2D241E]'
            }`}
            aria-label={clienteAtual ? `Conta de ${clienteAtual.nome}` : 'Entrar'}
          >
            <User className={`w-5 h-5 transition-transform ${activeView === 'identificacao' || activeView === 'cadastro' ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight mt-1 leading-none truncate max-w-[56px]">
              {clienteAtual ? clienteAtual.nome.split(' ')[0] : 'Entrar'}
            </span>
            {(activeView === 'identificacao' || activeView === 'cadastro') && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#8C482A]" />
            )}
          </button>
        )}

        {/* Tab 5: Admin */}
        <button
          onClick={() => setActiveView(activeView === 'admin' ? 'catalogo' : 'admin')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative cursor-pointer ${
            activeView === 'admin'
              ? 'text-[#8C482A] font-bold'
              : 'text-[#7E7267] hover:text-[#2D241E]'
          }`}
          aria-label="Painel Administrativo"
        >
          <Shield className={`w-5 h-5 transition-transform ${activeView === 'admin' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            {activeView === 'admin' ? 'Loja' : 'Admin'}
          </span>
          {activeView === 'admin' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#8C482A]" />
          )}
        </button>

      </div>
    </nav>
  );
};
