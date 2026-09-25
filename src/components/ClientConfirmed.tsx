import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, MessageCircle, ArrowRight, Clock, Store, Bike, MapPin, Star, Sparkles } from 'lucide-react';

export const ClientConfirmed: React.FC = () => {
  const { ultimoPedidoCriado, pedidos, setActiveView, setPedidoParaAvaliar, avaliacoes } = useStore();

  if (!ultimoPedidoCriado) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[#7E7267]">Nenhum pedido recente localizado.</p>
        <button
          onClick={() => setActiveView('catalogo')}
          className="mt-4 px-4 py-2 bg-[#8C482A] text-white rounded-lg text-xs"
        >
          Ir ao cardápio
        </button>
      </div>
    );
  }

  // Sincroniza com a versão mais recente em pedidos
  const p = pedidos.find(item => item.id === ultimoPedidoCriado.id) || ultimoPedidoCriado;

  // Montar texto para o WhatsApp
  const mensagemWhatsApp = encodeURIComponent(
    `🍰 *Olá, Casa de Bolos!*\n` +
    `Acabei de fazer o *Pedido #${p.id}* pelo site.\n\n` +
    `*Cliente:* ${p.cliente_nome}\n` +
    `*Tipo:* ${p.tipo_entrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada no balcão'}\n` +
    `*Total:* R$ ${p.total.toFixed(2).replace('.', ',')}\n\n` +
    `Aguardo a confirmação da confeitaria! Obrigado.`
  );

  const isEntregueOuRetirado = p.status === 'ENTREGUE' || p.status === 'RETIRADO';

  // Checa se todos os itens deste pedido já foram avaliados
  const itensNaoAvaliados = p.itens.filter(
    item => !avaliacoes.some(a => a.pedido_id === p.id && a.produto_id === item.produto_id)
  );

  return (
    <div className="max-w-lg mx-auto py-8 px-4 space-y-6">
      
      {/* Topo de Sucesso */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-3xl shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-[#8C482A]">
          Pedido Confirmado
        </span>

        <h1 className="font-serif text-3xl font-bold text-[#2D241E]">
          Pedido recebido!
        </h1>

        <p className="text-xs sm:text-sm text-[#7E7267] max-w-sm mx-auto">
          Obrigado por escolher a Casa de Bolos. Já começamos a cuidar de tudo com muito carinho.
        </p>
      </div>

      {/* Card Principal do Pedido */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#E8E2D9]">
        
        {/* Cabeçalho do Card */}
        <div className="p-5 flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7E7267] block">
              Identificador
            </span>
            <span className="font-serif text-2xl font-bold text-[#8C482A]">
              Pedido #{p.id}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7E7267] block">
              Status Atual
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              p.status === 'ENTREGUE' || p.status === 'RETIRADO'
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : p.status === 'SAIU PARA ENTREGA'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : p.status === 'EM PREPARO'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : p.status === 'PRONTO PARA RETIRADA' || p.status === 'PRONTO'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{p.status}</span>
            </span>
          </div>
        </div>

        {/* Card Especial de Avaliação (se Entregue ou Retirado) */}
        {isEntregueOuRetirado && (
          <div className="p-5 bg-gradient-to-r from-[#FAF0E6] to-[#FAF7F2] border-b border-[#E8D8C8]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C482A] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C482A] block">
                  Avaliação da Experiência
                </span>
                <h3 className="font-serif font-bold text-base text-[#2D241E] mt-0.5">
                  {itensNaoAvaliados.length > 0
                    ? 'O que você achou dos seus bolos?'
                    : 'Você já avaliou este pedido! ⭐'}
                </h3>
                <p className="text-xs text-[#7E7267] mt-1 leading-relaxed">
                  {itensNaoAvaliados.length > 0
                    ? `Seu pedido foi ${p.status.toLowerCase()}! Dê sua nota (1 a 5 estrelas) e ajude a confeitaria com seu depoimento.`
                    : 'Agradecemos muito pelo seu carinho e feedback. Esperamos adoçar seu dia novamente em breve!'}
                </p>

                {itensNaoAvaliados.length > 0 && (
                  <button
                    onClick={() => setPedidoParaAvaliar(p)}
                    className="mt-3 min-h-[44px] w-full sm:w-auto px-4 py-2.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-white text-white" />
                    <span>Avaliar Produtos Agora</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tipo de Recebimento */}
        <div className="p-5 space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7E7267] flex items-center gap-1.5">
            {p.tipo_entrega === 'entrega' ? <Bike className="w-3.5 h-3.5 text-[#8C482A]" /> : <Store className="w-3.5 h-3.5 text-[#8C482A]" />}
            <span>Recebimento</span>
          </div>
          <div className="font-bold text-sm text-[#2D241E]">
            {p.tipo_entrega === 'entrega' ? '🛵 Receber em Casa' : '🏪 Retirar na Loja'}
          </div>
          <p className="text-xs text-[#7E7267] flex items-start gap-1">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{p.endereco_entrega}</span>
          </p>
        </div>

        {/* Itens */}
        <div className="p-5 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#7E7267]">
            Itens ({p.itens.length})
          </div>
          <div className="space-y-1.5">
            {p.itens.map(item => (
              <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                <span>{item.quantidade}x {item.produto_nome}</span>
                <span className="font-semibold text-[#2D241E] tabular-nums">
                  R$ {item.subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="p-5 bg-[#FAF7F2] flex items-center justify-between">
          <span className="font-serif font-bold text-base text-[#2D241E]">
            Valor Total
          </span>
          <span className="font-sans font-bold text-2xl text-[#8C482A] tabular-nums">
            R$ {p.total.toFixed(2).replace('.', ',')}
          </span>
        </div>

      </div>

      {/* Ações */}
      <div className="space-y-3 pt-2">
        <a
          href={`https://wa.me/?text=${mensagemWhatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[48px] py-3.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enviar comprovante no WhatsApp</span>
        </a>

        <button
          onClick={() => setActiveView('catalogo')}
          className="w-full min-h-[48px] py-3.5 px-4 bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#2D241E] border border-[#E8E2D9] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Fazer outro pedido</span>
          <ArrowRight className="w-4 h-4 text-[#7E7267]" />
        </button>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveView('admin')}
            className="min-h-[44px] text-xs font-semibold text-[#8C482A] hover:underline inline-flex items-center cursor-pointer"
          >
            Ver este pedido no Painel Administrativo (/admin) →
          </button>
        </div>
      </div>

    </div>
  );
};
