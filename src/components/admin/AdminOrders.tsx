import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Pedido, StatusPedido, Notificacao } from '../../types';
import { X, Phone, MapPin, MessageSquare, Clock, Filter, MessageCircle, Send } from 'lucide-react';
import { WhatsAppSMSPreviewModal } from '../WhatsAppSMSPreviewModal';

export const AdminOrders: React.FC = () => {
  const { pedidos, atualizarStatusPedido, notificacoes } = useStore();
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [modalNotifPreview, setModalNotifPreview] = useState<Notificacao | null>(null);

  const statusParaEntrega: StatusPedido[] = [
    'NOVO',
    'CONFIRMADO',
    'EM PREPARO',
    'PRONTO',
    'SAIU PARA ENTREGA',
    'ENTREGUE',
    'CANCELADO'
  ];

  const statusParaRetirada: StatusPedido[] = [
    'NOVO',
    'CONFIRMADO',
    'EM PREPARO',
    'PRONTO PARA RETIRADA',
    'RETIRADO',
    'CANCELADO'
  ];

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroStatus === 'TODOS') return true;
    return p.status === filtroStatus;
  });

  const getStatusBadge = (status: StatusPedido) => {
    switch (status) {
      case 'NOVO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMADO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'EM PREPARO':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'PRONTO':
      case 'PRONTO PARA RETIRADA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SAIU PARA ENTREGA':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ENTREGUE':
      case 'RETIRADO':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'CANCELADO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Gerenciamento de Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
            Acompanhe o fluxo da cozinha e expedição dos pedidos.
          </p>
        </div>

        {/* Filtros em Abas */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['TODOS', 'NOVO', 'CONFIRMADO', 'EM PREPARO', 'PRONTO', 'SAIU PARA ENTREGA', 'ENTREGUE', 'CANCELADO'].map(st => (
            <button
              key={st}
              onClick={() => setFiltroStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                filtroStatus === st
                  ? 'bg-[#8C482A] text-white border-[#8C482A]'
                  : 'bg-[#FFFFFF] text-[#7E7267] border-[#E8E2D9] hover:bg-[#FAF7F2]'
              }`}
            >
              {st === 'TODOS' ? 'Todos' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        {/* Visualização em Cards para Mobile (< sm) */}
        <div className="sm:hidden divide-y divide-[#E8E2D9]">
          {pedidosFiltrados.map(p => (
            <div key={p.id} className="p-4 space-y-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#8C482A] text-sm">#{p.id}</span>
                    <span className="text-[11px] text-[#7E7267] tabular-nums">{p.created_at.split(' ')[1] || p.created_at}</span>
                  </div>
                  <h3 className="font-bold text-[#2D241E] text-sm mt-0.5">
                    {p.cliente_nome}
                  </h3>
                  <span className="text-xs text-[#7E7267] tabular-nums block">
                    {p.cliente_telefone}
                  </span>
                </div>

                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(p.status)}`}>
                  {p.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E8E2D9]/50">
                <span className="text-[#7E7267]">
                  {p.tipo_entrega === 'entrega' ? '🛵 Entrega' : '🏪 Retirada'} · {p.itens.reduce((sum, i) => sum + i.quantidade, 0)} un
                </span>
                <span className="font-sans font-bold text-base text-[#8C482A] tabular-nums">
                  R$ {p.total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={() => setPedidoSelecionado(p)}
                className="w-full min-h-[44px] py-2 bg-[#FAF7F2] hover:bg-[#8C482A] text-[#8C482A] hover:text-white rounded-xl text-xs font-semibold border border-[#E8E2D9] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Gerenciar Pedido #{p.id}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Tabela para Tablets e Desktop (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#7E7267] text-[11px] uppercase tracking-wider border-b border-[#E8E2D9]">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Telefone</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Data/Hora</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {pedidosFiltrados.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#8C482A]">
                    #{p.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#2D241E]">
                    {p.cliente_nome}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#7E7267] tabular-nums">
                    {p.cliente_telefone}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    {p.tipo_entrega === 'entrega' ? (
                      <span className="text-purple-700 font-medium">🛵 Entrega</span>
                    ) : (
                      <span className="text-amber-800 font-medium">🏪 Retirada</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#7E7267]">
                    {p.itens.reduce((sum, i) => sum + i.quantidade, 0)} un
                  </td>
                  <td className="py-3.5 px-4 font-sans font-bold text-[#2D241E] tabular-nums">
                    R$ {p.total.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#7E7267] tabular-nums">
                    {p.created_at}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setPedidoSelecionado(p)}
                      className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#8C482A] text-[#8C482A] hover:text-white rounded-lg text-xs font-semibold border border-[#E8E2D9] transition-colors cursor-pointer"
                    >
                      Gerenciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pedidosFiltrados.length === 0 && (
          <div className="text-center py-12 text-[#7E7267] text-xs sm:text-sm">
            Nenhum pedido encontrado para o filtro "{filtroStatus}".
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido e Alteração de Status */}
      {pedidoSelecionado && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPedidoSelecionado(null)}
        >
          <div 
            className="bg-[#FFFFFF] rounded-t-3xl sm:rounded-2xl border border-[#E8E2D9] w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[92vh] sm:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Pull Handle Indicator */}
            <div className="w-12 h-1.5 bg-[#D8D0C5] rounded-full mx-auto mt-2.5 sm:hidden" />

            {/* Cabeçalho */}
            <div className="p-4 sm:p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#7E7267] block">
                  Gerenciamento
                </span>
                <h2 className="font-serif text-xl font-bold text-[#2D241E]">
                  Pedido #{pedidoSelecionado.id}
                </h2>
              </div>
              <button
                onClick={() => setPedidoSelecionado(null)}
                className="min-w-[44px] min-h-[44px] rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#7E7267] hover:text-[#2D241E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              
              {/* Seletor de Status Conforme o Fluxo */}
              <div className="p-4 bg-[#FAF0E6] border border-[#E8D8C8] rounded-xl space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C482A]">
                  Alterar Status do Pedido
                </label>
                <div className="flex flex-wrap gap-2">
                  {(pedidoSelecionado.tipo_entrega === 'entrega' ? statusParaEntrega : statusParaRetirada).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        atualizarStatusPedido(pedidoSelecionado.id, st);
                        setPedidoSelecionado(prev => prev ? { ...prev, status: st } : null);
                      }}
                      className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        pedidoSelecionado.status === st
                          ? 'bg-[#8C482A] text-white shadow-xs'
                          : 'bg-white text-[#2D241E] border border-[#E8E2D9] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="space-y-1 text-xs sm:text-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7267] block">
                  Cliente
                </span>
                <p className="font-bold text-base text-[#2D241E]">
                  {pedidoSelecionado.cliente_nome}
                </p>
                <p className="text-xs text-[#7E7267] flex items-center gap-1.5 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#8C482A]" />
                  <span>{pedidoSelecionado.cliente_telefone}</span>
                </p>
              </div>

              {/* Destino / Recebimento */}
              <div className="space-y-1 text-xs sm:text-sm pt-2 border-t border-[#E8E2D9]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7267] block">
                  Recebimento
                </span>
                <p className="font-semibold text-[#2D241E]">
                  {pedidoSelecionado.tipo_entrega === 'entrega' ? '🛵 Entrega em Domicílio' : '🏪 Retirada no Balcão'}
                </p>
                <p className="text-xs text-[#7E7267] flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C482A] shrink-0 mt-0.5" />
                  <span>{pedidoSelecionado.endereco_entrega}</span>
                </p>
              </div>

              {/* Observação */}
              {pedidoSelecionado.observacao && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs space-y-1">
                  <span className="font-bold text-[#8C482A] flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>Observação do Cliente:</span>
                  </span>
                  <p className="text-[#2D241E] italic">"{pedidoSelecionado.observacao}"</p>
                </div>
              )}

              {/* Itens do Pedido */}
              <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7267] block">
                  Itens do Pedido
                </span>
                <div className="space-y-1.5">
                  {pedidoSelecionado.itens.map(i => (
                    <div key={i.id} className="flex justify-between items-center text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-[#2D241E]">{i.quantidade}x</span> {i.produto_nome}
                        {i.observacao && (
                          <span className="text-[11px] text-[#8C482A] block italic">"{i.observacao}"</span>
                        )}
                      </div>
                      <span className="font-medium tabular-nums">
                        R$ {i.subtotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totais */}
              <div className="pt-3 border-t border-[#E8E2D9] space-y-1 text-xs">
                <div className="flex justify-between text-[#7E7267]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">R$ {pedidoSelecionado.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[#7E7267]">
                  <span>Taxa de Entrega</span>
                  <span className="tabular-nums">R$ {pedidoSelecionado.taxa_entrega.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#2D241E] pt-1">
                  <span>Total</span>
                  <span className="text-[#8C482A] text-base tabular-nums">
                    R$ {pedidoSelecionado.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

            </div>

            <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const notif = notificacoes.find(n => n.pedido_id === pedidoSelecionado.id) || {
                    id: Date.now(),
                    tipo: 'status_pedido' as const,
                    destinatario: 'ambos' as const,
                    titulo: `Pedido #${pedidoSelecionado.id} (${pedidoSelecionado.status})`,
                    mensagem: `Status atual: ${pedidoSelecionado.status}. Cliente: ${pedidoSelecionado.cliente_nome}`,
                    pedido_id: pedidoSelecionado.id,
                    cliente_id: pedidoSelecionado.cliente_id,
                    cliente_nome: pedidoSelecionado.cliente_nome,
                    lida: true,
                    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    whatsapp_preview: {
                      telefone: pedidoSelecionado.cliente_telefone,
                      texto: `🍰 *Casa de Bolos:* Olá ${pedidoSelecionado.cliente_nome.split(' ')[0]}! Atualização do seu Pedido #${pedidoSelecionado.id}: *${pedidoSelecionado.status}*.`
                    },
                    sms_preview: {
                      telefone: pedidoSelecionado.cliente_telefone,
                      texto: `Casa de Bolos: Seu Pedido #${pedidoSelecionado.id} esta com status ${pedidoSelecionado.status}!`
                    }
                  };
                  setModalNotifPreview(notif);
                }}
                className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#FAF0E6] text-[#8C482A] border border-[#E8D8C8] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Simular Envio WhatsApp / SMS</span>
              </button>

              <button
                onClick={() => setPedidoSelecionado(null)}
                className="px-4 py-2 bg-[#8C482A] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Disparo WhatsApp/SMS/Webhook */}
      {modalNotifPreview && (
        <WhatsAppSMSPreviewModal
          notificacao={modalNotifPreview}
          onClose={() => setModalNotifPreview(null)}
        />
      )}

    </div>
  );
};
