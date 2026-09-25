import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Produto } from '../../types';
import { Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

export const AdminProducts: React.FC = () => {
  const {
    produtos,
    categorias,
    salvarProduto,
    alternarStatusProduto,
    excluirOuDesativarProduto
  } = useStore();

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Partial<Produto> | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const abrirNovo = () => {
    setProdutoEditando({
      categoria_id: categorias[0]?.id || 1,
      nome: '',
      descricao: '',
      preco: 39.90,
      imagem: '/src/assets/images/bolo_chocolate_1790270003751.jpg',
      ativo: true,
      destaque: false
    });
    setModalAberto(true);
  };

  const abrirEditar = (prod: Produto) => {
    setProdutoEditando({ ...prod });
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoEditando?.nome || !produtoEditando.preco) return;

    salvarProduto(produtoEditando);
    setModalAberto(false);
    setProdutoEditando(null);
    setAviso('Produto salvo com sucesso!');
    setTimeout(() => setAviso(null), 3000);
  };

  const handleExcluir = (id: number) => {
    if (confirm('Deseja realmente remover ou desativar este produto?')) {
      const res = excluirOuDesativarProduto(id);
      if (res === 'deactivated') {
        setAviso('O produto foi desativado para preservar o histórico de pedidos anteriores.');
      } else {
        setAviso('Produto excluído com sucesso.');
      }
      setTimeout(() => setAviso(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Cardápio de Produtos
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
            Gerencie bolos, doces, preços e destaques da vitrine.
          </p>
        </div>

        <button
          onClick={abrirNovo}
          className="px-4 py-2.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {aviso && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium animate-fadeIn">
          {aviso}
        </div>
      )}

      {/* Tabela de Produtos */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#7E7267] text-[11px] uppercase tracking-wider border-b border-[#E8E2D9]">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço</th>
                <th className="py-3 px-4">Destaque</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {produtos.map(prod => {
                const cat = categorias.find(c => c.id === prod.categoria_id);
                return (
                  <tr key={prod.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E8E2D9]">
                          <img
                            src={prod.imagem}
                            alt={prod.nome}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-[#2D241E] block line-clamp-1">
                            {prod.nome}
                          </span>
                          <span className="text-[11px] text-[#7E7267] line-clamp-1 max-w-xs">
                            {prod.descricao}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#7E7267]">
                      {cat?.nome || 'Geral'}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-[#8C482A] tabular-nums">
                      R$ {formatCurrency(prod.preco)}
                    </td>
                    <td className="py-3.5 px-4">
                      {prod.destaque ? (
                        <span className="text-amber-700 bg-amber-50 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Sim</span>
                        </span>
                      ) : (
                        <span className="text-[#7E7267] text-xs">Não</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => alternarStatusProduto(prod.id)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                          prod.ativo
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {prod.ativo ? '● Ativo' : '○ Inativo'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirEditar(prod)}
                          className="p-1.5 rounded-lg border border-[#E8E2D9] text-[#7E7267] hover:text-[#8C482A] hover:bg-[#FAF7F2]"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleExcluir(prod.id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          title="Excluir ou Desativar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulário de Produto */}
      {modalAberto && produtoEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D9] w-full max-w-md overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
              <h2 className="font-serif text-lg font-bold text-[#2D241E]">
                {produtoEditando.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#7E7267]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSalvar} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                  Nome do Bolo / Produto *
                </label>
                <input
                  type="text"
                  value={produtoEditando.nome || ''}
                  onChange={(e) => setProdutoEditando({ ...produtoEditando, nome: e.target.value })}
                  placeholder="Ex: Bolo de Cenoura com Brigadeiro"
                  required
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                    Categoria *
                  </label>
                  <select
                    value={produtoEditando.categoria_id}
                    onChange={(e) => setProdutoEditando({ ...produtoEditando, categoria_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                  >
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="1"
                    value={produtoEditando.preco ?? 35}
                    onChange={(e) => setProdutoEditando({ ...produtoEditando, preco: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={produtoEditando.descricao || ''}
                  onChange={(e) => setProdutoEditando({ ...produtoEditando, descricao: e.target.value })}
                  placeholder="Massa artesanal fofinha com calda de chocolate..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                  URL / Imagem
                </label>
                <input
                  type="text"
                  value={produtoEditando.imagem || ''}
                  onChange={(e) => setProdutoEditando({ ...produtoEditando, imagem: e.target.value })}
                  placeholder="/src/assets/images/bolo_chocolate_1790270003751.jpg"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={produtoEditando.ativo ?? true}
                    onChange={(e) => setProdutoEditando({ ...produtoEditando, ativo: e.target.checked })}
                    className="w-4 h-4 text-[#8C482A] rounded focus:ring-0"
                  />
                  <span>Ativo no Cardápio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={produtoEditando.destaque ?? false}
                    onChange={(e) => setProdutoEditando({ ...produtoEditando, destaque: e.target.checked })}
                    className="w-4 h-4 text-[#8C482A] rounded focus:ring-0"
                  />
                  <span>Destaque (Mais Pedido)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2D9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 border border-[#E8E2D9] text-[#7E7267] rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
