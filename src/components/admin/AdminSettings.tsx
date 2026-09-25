import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, CheckCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { config, atualizarConfig } = useStore();
  const [taxa, setTaxa] = useState(config.taxa_entrega.toString());
  const [nome, setNome] = useState(config.nome);
  const [telefone, setTelefone] = useState(config.telefone);
  const [endereco, setEndereco] = useState(config.endereco);
  const [salvo, setSalvo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarConfig({
      taxa_entrega: parseFloat(taxa) || 0,
      nome,
      telefone,
      endereco
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
          Configurações da Confeitaria
        </h1>
        <p className="text-xs sm:text-sm text-[#7E7267] mt-0.5">
          Ajuste taxa de entrega, dados operacionais e endereço da loja física.
        </p>
      </div>

      {salvo && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configurações salvas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs text-xs sm:text-sm">
        
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
            Taxa Fixa de Entrega (R$) *
          </label>
          <input
            type="number"
            step="0.50"
            min="0"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-semibold text-[#8C482A] focus:bg-white focus:border-[#8C482A] focus:outline-none tabular-nums"
          />
          <p className="text-[11px] text-[#7E7267] mt-1">
            Cobrada automaticamente quando o cliente escolhe a opção "Receber em casa".
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
            Nome Comercial da Loja
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
            WhatsApp / Telefone de Contato
          </label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none tabular-nums"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D241E] mb-1">
            Endereço Físico (Ponto de Retirada)
          </label>
          <textarea
            rows={2}
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
          />
          <p className="text-[11px] text-[#7E7267] mt-1">
            Exibido para os clientes que escolhem "Retirar na loja".
          </p>
        </div>

        <div className="pt-3 border-t border-[#E8E2D9] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>

      </form>

      {/* Render Deploy & Healthcheck Panel */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-6 space-y-4 shadow-xs text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-bold text-sm text-[#2D241E]">
              Otimização de Deploy no Render
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
            Pronto para Produção
          </span>
        </div>

        <p className="text-[#7E7267] text-xs leading-relaxed">
          Esta aplicação está configurada com suporte a <strong>Node.js 22</strong>, blueprint <code>render.yaml</code>, compressão Gzip/Deflate para carregamento instantâneo, e verificação contínua de integridade para zero downtime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E7267] block">
              Healthcheck Endpoint
            </span>
            <code className="text-xs font-mono font-semibold text-[#8C482A] block">
              /api/health
            </code>
            <span className="text-[10px] text-[#7E7267]">
              Monitoramento ativo de uptime e memória
            </span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9]/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E7267] block">
              Comandos de Deploy
            </span>
            <span className="text-[11px] font-mono text-[#2D241E] block">
              Build: <code className="text-[#8C482A]">npm install && npm run build</code>
            </span>
            <span className="text-[11px] font-mono text-[#2D241E] block">
              Start: <code className="text-[#8C482A]">npm start</code>
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
          <span>💡</span>
          <div>
            <strong>Dica para o Render Free:</strong> Consulte o arquivo <code>DEPLOY_RENDER.md</code> na raiz do projeto para o passo a passo de conexão ao GitHub e ativação com 1 clique usando Blueprint.
          </div>
        </div>
      </div>
    </div>
  );
};

