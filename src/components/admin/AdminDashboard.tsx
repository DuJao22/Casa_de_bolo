import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DollarSign, ShoppingBag, ChefHat, Clock, ArrowRight, Star } from 'lucide-react';
import { StatusPedido } from '../../types';

export const AdminDashboard: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { pedidos, atualizarStatusPedido, avaliacoes } = useStore();

  const hojeStr = new Date().toISOString().substring(0, 10);
  const pedidosHoje = pedidos.filter(p => p.created_at.startsWith(hojeStr) && p.status !== 'CANCELADO');
  const faturamentoHoje = pedidosHoje.reduce((sum, p) => sum + p.total, 0);

  const emPreparo = pedidos.filter(p => p.status === 'EM PREPARO' || p.status === 'CONFIRMADO').length;
  const novosAguardando = pedidos.filter(p => p.status === 'NOVO').length;

  const somaNotas = avaliacoes.reduce((sum, a) => sum + a.nota, 0);
  const mediaNotas = avaliacoes.length > 0 ? (somaNotas / avaliacoes.length).toFixed(1) : '5.0';
  const pendentesMod = avaliacoes.filter(a => a.status === 'pendente').length;

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
      
      {/* 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Faturamento Hoje */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7E7267] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Faturamento Hoje</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#8C482A] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans font-bold text-2xl text-[#8C482A] tabular-nums">
            R$ {faturamentoHoje.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-[#7E7267] block mt-1">
            {pedidosHoje.length} pedidos hoje
          </span>
        </div>

        {/* Total de Pedidos Hoje */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7E7267] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pedidos Hoje</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#2D241E] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans font-bold text-2xl text-[#2D241E] tabular-nums">
            {pedidosHoje.length}
          </div>
          <span className="text-[11px] text-[#7E7267] block mt-1">
            Recebidos no sistema
          </span>
        </div>

        {/* Em Preparo */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7E7267] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Em Preparo</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans font-bold text-2xl text-orange-700 tabular-nums">
            {emPreparo}
          </div>
          <span className="text-[11px] text-[#7E7267] block mt-1">
            Na cozinha agora
          </span>
        </div>

        {/* Aguardando Confirmação */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7E7267] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Novos / Aguardando</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sans font-bold text-2xl text-blue-700 tabular-nums">
            {novosAguardando}
          </div>
          <span className="text-[11px] text-[#7E7267] block mt-1">
            Precisam de ação rápida
          </span>
        </div>

      </div>

      {/* Banner de Satisfação e Moderação de Avaliações */}
      <div className="bg-gradient-to-r from-[#FAF0E6] to-[#FAF7F2] border border-[#E8D8C8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#8C482A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Star className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#2D241E]">
                Satisfação dos Clientes: {mediaNotas} de 5.0
              </h3>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(Number(mediaNotas)) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#7E7267] mt-0.5">
              {avaliacoes.length} avaliações registradas. {pendentesMod > 0 ? (
                <strong className="text-amber-700 font-bold">{pendentesMod} nova(s) aguardando sua moderação!</strong>
              ) : (
                'Todas as avaliações estão moderadas e em dia.'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('avaliacoes')}
          className="px-4 py-2 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          <span>Ir para Avaliações</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabela de Pedidos Recentes com Ações Rápidas */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        
        <div className="p-4 sm:p-5 border-b border-[#E8E2D9] flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#2D241E]">
              Pedidos Recentes
            </h2>
            <p className="text-xs text-[#7E7267]">Últimos pedidos registrados no sistema</p>
          </div>
          <button
            onClick={() => onNavigateTab('pedidos')}
            className="text-xs font-semibold text-[#8C482A] hover:underline flex items-center gap-1"
          >
            <span>Ver todos ({pedidos.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#7E7267] text-[11px] uppercase tracking-wider border-b border-[#E8E2D9]">
              <tr>
                <th className="py-3 px-4">Pedido</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Recebimento</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {pedidos.slice(0, 6).map(p => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#8C482A]">
                    #{p.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#2D241E] block">{p.cliente_nome}</span>
                    <span className="text-[11px] text-[#7E7267] tabular-nums">{p.cliente_telefone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    {p.tipo_entrega === 'entrega' ? (
                      <span className="text-purple-700 font-medium">🛵 Entrega</span>
                    ) : (
                      <span className="text-amber-800 font-medium">🏪 Retirada</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-bold text-[#2D241E] tabular-nums">
                    R$ {p.total.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === 'NOVO' && (
                      <button
                        onClick={() => atualizarStatusPedido(p.id, 'CONFIRMADO')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold"
                      >
                        Confirmar
                      </button>
                    )}
                    {p.status === 'CONFIRMADO' && (
                      <button
                        onClick={() => atualizarStatusPedido(p.id, 'EM PREPARO')}
                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-[11px] font-semibold"
                      >
                        Iniciar Preparo
                      </button>
                    )}
                    {p.status === 'EM PREPARO' && (
                      <button
                        onClick={() => atualizarStatusPedido(p.id, p.tipo_entrega === 'entrega' ? 'PRONTO' : 'PRONTO PARA RETIRADA')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                      >
                        Pronto!
                      </button>
                    )}
                    {p.status === 'PRONTO' && p.tipo_entrega === 'entrega' && (
                      <button
                        onClick={() => atualizarStatusPedido(p.id, 'SAIU PARA ENTREGA')}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-semibold"
                      >
                        Despachar
                      </button>
                    )}
                    {(p.status === 'SAIU PARA ENTREGA' || p.status === 'PRONTO PARA RETIRADA') && (
                      <button
                        onClick={() => atualizarStatusPedido(p.id, p.tipo_entrega === 'entrega' ? 'ENTREGUE' : 'RETIRADO')}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold"
                      >
                        Finalizar
                      </button>
                    )}
                    {(p.status === 'ENTREGUE' || p.status === 'RETIRADO' || p.status === 'CANCELADO') && (
                      <button
                        onClick={() => onNavigateTab('pedidos')}
                        className="text-xs text-[#7E7267] hover:underline"
                      >
                        Detalhes
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
