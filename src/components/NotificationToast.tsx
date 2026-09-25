import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, MessageCircle, Star, X, Bell, Bike, Store, Sparkles } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toastAtual, setToastAtual, pedidos, setPedidoParaAvaliar } = useStore();

  useEffect(() => {
    if (!toastAtual) return;
    const timer = setTimeout(() => {
      setToastAtual(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [toastAtual, setToastAtual]);

  if (!toastAtual) return null;

  // Verifica se o pedido vinculado é elegível para avaliação
  const pedidoVinculado = toastAtual.pedido_id 
    ? pedidos.find(p => p.id === toastAtual.pedido_id) 
    : null;

  const isEligivelAvaliacao = pedidoVinculado && (pedidoVinculado.status === 'ENTREGUE' || pedidoVinculado.status === 'RETIRADO');

  const getIcon = () => {
    if (toastAtual.tipo === 'nova_avaliacao') {
      return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
    }
    if (toastAtual.titulo.includes('Entregue')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (toastAtual.titulo.includes('Retirado') || toastAtual.titulo.includes('Balcão')) {
      return <Store className="w-5 h-5 text-[#8C482A]" />;
    }
    if (toastAtual.titulo.includes('Caminho')) {
      return <Bike className="w-5 h-5 text-purple-600" />;
    }
    return <Sparkles className="w-5 h-5 text-[#8C482A]" />;
  };

  return (
    <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-slideDown pointer-events-auto">
      <div className="bg-[#FFFFFF] border-2 border-[#8C482A]/30 rounded-2xl p-4 shadow-xl text-[#2D241E] backdrop-blur-md bg-white/95">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF0E6] flex items-center justify-center shrink-0 border border-[#E8D8C8]">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C482A] bg-[#FAF0E6] px-1.5 py-0.5 rounded">
                Notificação em Tempo Real
              </span>
              <span className="text-[10px] text-[#7E7267] tabular-nums">Agora</span>
            </div>

            <h4 className="font-serif font-bold text-sm text-[#2D241E] mt-1 leading-snug">
              {toastAtual.titulo}
            </h4>

            <p className="text-xs text-[#7E7267] mt-1 leading-relaxed">
              {toastAtual.mensagem}
            </p>

            {/* Ações Rápidas no Toast */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isEligivelAvaliacao && (
                <button
                  onClick={() => {
                    if (pedidoVinculado) {
                      setPedidoParaAvaliar(pedidoVinculado);
                    }
                    setToastAtual(null);
                  }}
                  className="px-3 py-1.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>Avaliar Produtos Agora</span>
                </button>
              )}

              {toastAtual.whatsapp_preview && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(toastAtual.whatsapp_preview.texto)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-[#25D366]/30"
                  title="Abrir no WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          <button
            onClick={() => setToastAtual(null)}
            className="min-w-[40px] min-h-[40px] text-[#7E7267] hover:text-[#2D241E] rounded-xl hover:bg-[#FAF7F2] transition-colors flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
