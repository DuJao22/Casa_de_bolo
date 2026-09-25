import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Cliente, Pedido } from '../../types';
import { Phone, MapPin, Calendar, ShoppingBag, X } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { clientes, pedidos } = useStore();
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  // Calcula estatísticas por cliente
  const getClienteStats = (clienteId: number) => {
    const pedidosCliente = pedidos.filter(p => p.cliente_id === clienteId);
    const totalGasto = pedidosCliente.reduce((sum, p) => sum + (p.status !== 'CANCELADO' ? p.total : 0), 0);
    const ultimo = pedidosCliente.length > 0 ? pedidosCliente[0].created_at : 'Nenhum';
    return {
      totalPedidos: pedidosCliente.length,
      totalGasto,
      ultimoPedido: ultimo,
      pedidos: pedidosCliente
    };
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
          Base de Clientes
        </h1>
        <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
          Consulte o histórico de consumo e fidelidade dos clientes cadastrados.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#7E7267] text-[11px] uppercase tracking-wider border-b border-[#E8E2D9]">
              <tr>
                <th className="py-3 px-4">Nome do Cliente</th>
                <th className="py-3 px-4">Telefone</th>
                <th className="py-3 px-4">Endereço Padrão</th>
                <th className="py-3 px-4">Pedidos</th>
                <th className="py-3 px-4">Total Comprado</th>
                <th className="py-3 px-4">Último Pedido</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {clientes.map(cli => {
                const stats = getClienteStats(cli.id);
                return (
                  <tr key={cli.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2D241E]">
                      {cli.nome}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#7E7267] tabular-nums">
                      {cli.telefone}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#7E7267] max-w-xs truncate">
                      {cli.endereco ? `${cli.endereco}, ${cli.numero} - ${cli.bairro}` : 'Não cadastrado'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2D241E] tabular-nums">
                      {stats.totalPedidos} un
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-[#8C482A] tabular-nums">
                      R$ {stats.totalGasto.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#7E7267] tabular-nums">
                      {stats.ultimoPedido}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setClienteSelecionado(cli)}
                        className="px-3 py-1 bg-[#FAF7F2] hover:bg-[#8C482A] text-[#8C482A] hover:text-white rounded-lg text-xs font-semibold border border-[#E8E2D9] transition-colors"
                      >
                        Histórico
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Histórico do Cliente */}
      {clienteSelecionado && (() => {
        const stats = getClienteStats(clienteSelecionado.id);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div 
              className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D9] w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
                <div>
                  <span className="text-[11px] uppercase font-bold text-[#7E7267] block">
                    Ficha do Cliente
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D241E]">
                    {clienteSelecionado.nome}
                  </h2>
                </div>
                <button
                  onClick={() => setClienteSelecionado(null)}
                  className="w-7 h-7 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#7E7267]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
                
                {/* Dados de Contato e Resumo */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] space-y-2">
                  <div className="flex items-center gap-2 text-[#7E7267]">
                    <Phone className="w-4 h-4 text-[#8C482A]" />
                    <span className="font-semibold text-[#2D241E] tabular-nums">{clienteSelecionado.telefone}</span>
                  </div>
                  {clienteSelecionado.endereco && (
                    <div className="flex items-start gap-2 text-[#7E7267]">
                      <MapPin className="w-4 h-4 text-[#8C482A] shrink-0 mt-0.5" />
                      <span>{clienteSelecionado.endereco}, {clienteSelecionado.numero} {clienteSelecionado.complemento} - {clienteSelecionado.bairro}, {clienteSelecionado.cidade}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#7E7267] pt-1 border-t border-[#E8E2D9]/60">
                    <Calendar className="w-4 h-4 text-[#8C482A]" />
                    <span>Cadastrado em {clienteSelecionado.created_at}</span>
                  </div>
                </div>

                {/* Métricas do Cliente */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-[#FFFFFF] border border-[#E8E2D9] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#7E7267] block">Total de Pedidos</span>
                    <span className="font-bold text-lg text-[#2D241E] tabular-nums">{stats.totalPedidos}</span>
                  </div>
                  <div className="p-3 bg-[#FFFFFF] border border-[#E8E2D9] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#7E7267] block">Total Investido</span>
                    <span className="font-bold text-lg text-[#8C482A] tabular-nums">R$ {stats.totalGasto.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* Histórico de Pedidos */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7E7267] block">
                    Histórico de Pedidos
                  </span>

                  {stats.pedidos.length > 0 ? (
                    <div className="space-y-2">
                      {stats.pedidos.map(p => (
                        <div key={p.id} className="p-3 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#8C482A] block">#{p.id} · {p.tipo_entrega === 'entrega' ? '🛵 Entrega' : '🏪 Retirada'}</span>
                            <span className="text-[11px] text-[#7E7267]">{p.created_at}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#2D241E] block tabular-nums">R$ {p.total.toFixed(2).replace('.', ',')}</span>
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white border border-[#E8E2D9]">
                              {p.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#7E7267] italic">Nenhum pedido feito ainda.</p>
                  )}
                </div>

              </div>

              <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex justify-end">
                <button
                  onClick={() => setClienteSelecionado(null)}
                  className="px-4 py-2 bg-[#8C482A] text-white rounded-lg text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
