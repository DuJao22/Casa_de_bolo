import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Avaliacao, StatusAvaliacao } from '../../types';
import { formatRating } from '../../utils/format';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Send,
  Filter,
  Cake,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const {
    avaliacoes,
    moderarAvaliacao,
    responderAvaliacao,
    excluirAvaliacao,
    produtos
  } = useStore();

  const [filtroStatus, setFiltroStatus] = useState<string>('TODAS');
  const [filtroNota, setFiltroNota] = useState<number | 'TODAS'>('TODAS');
  const [idRespondendo, setIdRespondendo] = useState<number | null>(null);
  const [textoResposta, setTextoResposta] = useState<string>('');

  // Cálculos de métricas
  const totalAvaliacoes = avaliacoes.length;
  const pendentes = avaliacoes.filter(a => a.status === 'pendente').length;
  const aprovadas = avaliacoes.filter(a => a.status === 'aprovada').length;
  const rejeitadas = avaliacoes.filter(a => a.status === 'rejeitada').length;

  const somaNotas = avaliacoes.reduce((acc, a) => acc + (Number(a?.nota) || 5), 0);
  const mediaGeral = totalAvaliacoes > 0 ? formatRating(somaNotas / totalAvaliacoes) : '5.0';

  // Filtragem
  const avaliacoesFiltradas = avaliacoes.filter(a => {
    if (filtroStatus !== 'TODAS' && a.status !== filtroStatus) return false;
    if (filtroNota !== 'TODAS' && a.nota !== filtroNota) return false;
    return true;
  });

  const handleSalvarResposta = (id: number) => {
    if (!textoResposta.trim()) return;
    responderAvaliacao(id, textoResposta);
    setIdRespondendo(null);
    setTextoResposta('');
  };

  const getStatusBadge = (status: StatusAvaliacao) => {
    switch (status) {
      case 'aprovada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pendente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejeitada':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Moderação de Avaliações
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
            Visualize os depoimentos dos clientes, modere notas e responda aos elogios e feedbacks.
          </p>
        </div>

        {/* Resumo Rápido da Reputação */}
        <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#E8E2D9] px-4 py-2.5 rounded-xl shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xl text-[#2D241E] leading-none">
                {mediaGeral}
              </span>
              <span className="text-xs text-[#7E7267]">/ 5.0</span>
            </div>
            <span className="text-[11px] text-[#7E7267]">Média geral da Confeitaria</span>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#7E7267] block">
            Total Recebidas
          </span>
          <span className="font-serif text-2xl font-bold text-[#2D241E] mt-1 block">
            {totalAvaliacoes}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 block">
            Pendentes
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-serif text-2xl font-bold text-amber-800">
              {pendentes}
            </span>
            {pendentes > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                Ação necessária
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700 block">
            Aprovadas (No Site)
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-800 mt-1 block">
            {aprovadas}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-rose-700 block">
            Rejeitadas
          </span>
          <span className="font-serif text-2xl font-bold text-rose-800 mt-1 block">
            {rejeitadas}
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E8E2D9] p-3 rounded-2xl">
        {/* Filtro por Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'TODAS', label: 'Todas' },
            { id: 'pendente', label: `Pendentes (${pendentes})` },
            { id: 'aprovada', label: `Aprovadas (${aprovadas})` },
            { id: 'rejeitada', label: `Rejeitadas (${rejeitadas})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFiltroStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                filtroStatus === tab.id
                  ? 'bg-[#8C482A] text-white border-[#8C482A]'
                  : 'bg-[#FAF7F2] text-[#7E7267] border-[#E8E2D9] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filtro por Nota de Estrelas */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[#7E7267] font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Nota:</span>
          </span>
          <button
            onClick={() => setFiltroNota('TODAS')}
            className={`px-2 py-1 rounded text-xs font-semibold ${filtroNota === 'TODAS' ? 'bg-[#2D241E] text-white' : 'bg-[#FAF7F2] text-[#7E7267]'}`}
          >
            Todas
          </button>
          {[5, 4, 3, 2, 1].map(n => (
            <button
              key={n}
              onClick={() => setFiltroNota(n)}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-0.5 ${
                filtroNota === n ? 'bg-[#8C482A] text-white' : 'bg-[#FAF7F2] text-[#7E7267] hover:bg-white'
              }`}
            >
              <span>{n}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {avaliacoesFiltradas.map(av => {
          const produto = produtos.find(p => p.id === av.produto_id);
          const isRespondendo = idRespondendo === av.id;

          return (
            <div
              key={av.id}
              className={`bg-[#FFFFFF] border rounded-2xl p-5 shadow-xs space-y-4 transition-all ${
                av.status === 'pendente' ? 'border-amber-300 ring-1 ring-amber-100' : 'border-[#E8E2D9]'
              }`}
            >
              {/* Topo do Card de Avaliação */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D9]/70 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] overflow-hidden border border-[#E8E2D9] shrink-0">
                    {produto?.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={av.produto_nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8C482A]">
                        <Cake className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2D241E]">
                      {av.produto_nome}
                    </h3>
                    <div className="text-xs text-[#7E7267] flex items-center gap-2 mt-0.5">
                      <span>Por <strong>{av.cliente_nome}</strong></span>
                      <span>·</span>
                      <span>Pedido #{av.pedido_id}</span>
                      <span>·</span>
                      <span className="tabular-nums">{av.created_at}</span>
                    </div>
                  </div>
                </div>

                {/* Estrelas e Badge de Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E8E2D9]">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= av.nota ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-[#2D241E] tabular-nums">
                      {av.nota}.0
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(av.status)}`}>
                    {av.status}
                  </span>
                </div>
              </div>

              {/* Comentário do Cliente */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl text-xs sm:text-sm text-[#2D241E] leading-relaxed">
                "{av.comentario}"
              </div>

              {/* Resposta do Administrador (se houver) */}
              {av.resposta_admin && !isRespondendo && (
                <div className="p-3 bg-[#FAF0E6] border border-[#E8D8C8] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8C482A] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Resposta Oficial da Confeitaria:</span>
                    </span>
                    <button
                      onClick={() => {
                        setIdRespondendo(av.id);
                        setTextoResposta(av.resposta_admin || '');
                      }}
                      className="text-[11px] text-[#8C482A] hover:underline"
                    >
                      Editar resposta
                    </button>
                  </div>
                  <p className="text-[#2D241E] leading-relaxed">{av.resposta_admin}</p>
                </div>
              )}

              {/* Formulário Inline de Resposta */}
              {isRespondendo && (
                <div className="p-3 bg-[#FAF0E6] border border-[#8C482A]/30 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-[#8C482A]">
                    Sua Resposta para {av.cliente_nome}:
                  </label>
                  <textarea
                    rows={2}
                    value={textoResposta}
                    onChange={(e) => setTextoResposta(e.target.value)}
                    placeholder="Ex: Muito obrigado pelo carinho, ficamos muito felizes que tenha gostado!"
                    className="w-full p-2.5 bg-white border border-[#E8D8C8] rounded-lg text-xs text-[#2D241E] focus:outline-none focus:border-[#8C482A] resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => { setIdRespondendo(null); setTextoResposta(''); }}
                      className="px-3 py-1.5 text-xs text-[#7E7267] hover:bg-white rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSalvarResposta(av.id)}
                      className="px-3 py-1.5 bg-[#8C482A] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Salvar Resposta</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botões de Ação e Moderação */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8E2D9]/50">
                <div className="flex flex-wrap items-center gap-2">
                  {av.status !== 'aprovada' && (
                    <button
                      onClick={() => moderarAvaliacao(av.id, 'aprovada')}
                      className="min-h-[44px] px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Aprovar</span>
                    </button>
                  )}

                  {av.status !== 'rejeitada' && (
                    <button
                      onClick={() => moderarAvaliacao(av.id, 'rejeitada')}
                      className="min-h-[44px] px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeitar</span>
                    </button>
                  )}

                  {!isRespondendo && !av.resposta_admin && (
                    <button
                      onClick={() => {
                        setIdRespondendo(av.id);
                        setTextoResposta('');
                      }}
                      className="min-h-[44px] px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#FAF0E6] text-[#8C482A] border border-[#E8E2D9] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Responder</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta avaliação permanentemente?')) {
                      excluirAvaliacao(av.id);
                    }
                  }}
                  className="min-h-[44px] px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Excluir do sistema"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>

            </div>
          );
        })}

        {avaliacoesFiltradas.length === 0 && (
          <div className="text-center py-12 bg-[#FFFFFF] border border-dashed border-[#E8E2D9] rounded-2xl p-6">
            <p className="text-sm font-semibold text-[#2D241E]">Nenhuma avaliação encontrada</p>
            <p className="text-xs text-[#7E7267] mt-1">
              Não há avaliações para os filtros selecionados ({filtroStatus} / {filtroNota !== 'TODAS' ? `${filtroNota} estrelas` : 'todas as notas'}).
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
