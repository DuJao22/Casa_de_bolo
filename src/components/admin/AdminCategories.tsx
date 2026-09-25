import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Categoria } from '../../types';
import { Plus, Edit2, Check, X } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categorias, salvarCategoria, alternarCategoria } = useStore();
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Partial<Categoria> | null>(null);

  const abrirNovo = () => {
    setCategoriaEditando({
      nome: '',
      descricao: '',
      ordem: categorias.length + 1,
      ativo: true
    });
    setModalAberto(true);
  };

  const abrirEditar = (cat: Categoria) => {
    setCategoriaEditando({ ...cat });
    setModalAberto(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoriaEditando?.nome) return;
    salvarCategoria(categoriaEditando);
    setModalAberto(false);
    setCategoriaEditando(null);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Categorias do Cardápio
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
            Organize as abas exibidas para os clientes no cardápio online.
          </p>
        </div>

        <button
          onClick={abrirNovo}
          className="px-4 py-2.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-[#7E7267] text-[11px] uppercase tracking-wider border-b border-[#E8E2D9]">
              <tr>
                <th className="py-3 px-4">Ordem</th>
                <th className="py-3 px-4">Nome da Categoria</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {categorias.sort((a, b) => a.ordem - b.ordem).map(cat => (
                <tr key={cat.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#8C482A] tabular-nums">
                    #{cat.ordem}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#2D241E]">
                    {cat.nome}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#7E7267]">
                    {cat.descricao}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => alternarCategoria(cat.id)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                        cat.ativo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {cat.ativo ? '● Ativa' : '○ Inativa'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => abrirEditar(cat)}
                      className="p-1.5 rounded-lg border border-[#E8E2D9] text-[#7E7267] hover:text-[#8C482A] hover:bg-[#FAF7F2]"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Categoria */}
      {modalAberto && categoriaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D9] w-full max-w-sm overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
              <h2 className="font-serif text-lg font-bold text-[#2D241E]">
                {categoriaEditando.id ? 'Editar Categoria' : 'Nova Categoria'}
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
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={categoriaEditando.nome || ''}
                  onChange={(e) => setCategoriaEditando({ ...categoriaEditando, nome: e.target.value })}
                  placeholder="Ex: Bolos Vulcão"
                  required
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  value={categoriaEditando.descricao || ''}
                  onChange={(e) => setCategoriaEditando({ ...categoriaEditando, descricao: e.target.value })}
                  placeholder="Ex: Cobertura generosa que transborda"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={categoriaEditando.ordem ?? 1}
                  onChange={(e) => setCategoriaEditando({ ...categoriaEditando, ordem: parseInt(e.target.value) || 1 })}
                  className="w-24 px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none tabular-nums"
                />
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
