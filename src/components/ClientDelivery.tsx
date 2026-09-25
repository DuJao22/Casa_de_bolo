import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Store, Bike, ArrowRight, ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { TipoEntrega } from '../types';
import { formatCurrency } from '../utils/format';

export const ClientDelivery: React.FC = () => {
  const {
    tipoEntrega,
    setTipoEntrega,
    enderecoEntrega,
    setEnderecoEntrega,
    clienteAtual,
    config,
    setActiveView
  } = useStore();

  const [rua, setRua] = useState(clienteAtual?.endereco || 'Rua das Flores');
  const [numero, setNumero] = useState(clienteAtual?.numero || '450');
  const [complemento, setComplemento] = useState(clienteAtual?.complemento || 'Apto 32');
  const [bairro, setBairro] = useState(clienteAtual?.bairro || 'Jardins');
  const [cidade, setCidade] = useState(clienteAtual?.cidade || 'São Paulo');

  const preencherEnderecoAutomatico = () => {
    setRua('Rua das Flores');
    setNumero('450');
    setComplemento('Apto 32');
    setBairro('Jardins');
    setCidade('São Paulo');
  };

  useEffect(() => {
    if (tipoEntrega === 'retirada') {
      setEnderecoEntrega('Retirada no balcão da loja');
    } else {
      const parts = [
        rua ? `${rua}, ${numero || 'S/N'}` : '',
        complemento ? `(${complemento})` : '',
        bairro,
        cidade
      ].filter(Boolean);
      setEnderecoEntrega(parts.join(' - '));
    }
  }, [tipoEntrega, rua, numero, complemento, bairro, cidade, setEnderecoEntrega]);

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoEntrega === 'entrega') {
      if (!rua.trim() || !numero.trim() || !bairro.trim()) {
        return;
      }
    }
    setActiveView('resumo');
  };

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
      
      <button
        onClick={() => setActiveView('carrinho')}
        className="min-h-[44px] text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao carrinho</span>
      </button>

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E]">
          Como você deseja receber seu pedido?
        </h1>
        <p className="text-xs sm:text-sm text-[#7E7267] mt-1">
          Escolha entre retirar na loja ou receber em casa com segurança.
        </p>
      </div>

      <form onSubmit={handleContinuar} className="space-y-6">
        
        {/* Opções de Recebimento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Card Retirada */}
          <div
            onClick={() => setTipoEntrega('retirada')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              tipoEntrega === 'retirada'
                ? 'border-[#8C482A] bg-[#FAF0E6] shadow-xs'
                : 'border-[#E8E2D9] bg-[#FFFFFF] hover:border-[#8C482A]/40'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D9] flex items-center justify-center text-[#8C482A]">
                  <Store className="w-5 h-5" />
                </div>
                {tipoEntrega === 'retirada' && (
                  <CheckCircle className="w-5 h-5 text-[#8C482A]" />
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D241E]">
                Retirar na loja
              </h3>
              <p className="text-xs text-[#7E7267] leading-relaxed">
                Sem taxa de entrega. Pegue quentinho no nosso balcão.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E2D9]/60">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Grátis
              </span>
              <span className="text-[11px] text-[#7E7267] block mt-1">
                {config.endereco}
              </span>
            </div>
          </div>

          {/* Card Entrega */}
          <div
            onClick={() => setTipoEntrega('entrega')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              tipoEntrega === 'entrega'
                ? 'border-[#8C482A] bg-[#FAF0E6] shadow-xs'
                : 'border-[#E8E2D9] bg-[#FFFFFF] hover:border-[#8C482A]/40'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D9] flex items-center justify-center text-[#8C482A]">
                  <Bike className="w-5 h-5" />
                </div>
                {tipoEntrega === 'entrega' && (
                  <CheckCircle className="w-5 h-5 text-[#8C482A]" />
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D241E]">
                Receber em casa
              </h3>
              <p className="text-xs text-[#7E7267] leading-relaxed">
                Informe seu endereço e entregamos com todo cuidado.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E2D9]/60">
              <span className="text-xs font-bold text-[#8C482A] tabular-nums">
                Taxa fixa: R$ {formatCurrency(config?.taxa_entrega)}
              </span>
              <span className="text-[11px] text-[#7E7267] block mt-1">
                Entrega rápida na sua região
              </span>
            </div>
          </div>

        </div>

        {/* Formulário de Endereço (se entrega selecionada) */}
        {tipoEntrega === 'entrega' && (
          <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm animate-fadeIn">
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C482A]">
                <MapPin className="w-4 h-4" />
                <span>Endereço para Entrega</span>
              </div>
              <button
                type="button"
                onClick={preencherEnderecoAutomatico}
                className="text-[11px] font-semibold text-[#8C482A] bg-[#FAF0E6] hover:bg-[#8C482A] hover:text-white px-2.5 py-1 rounded-lg border border-[#E8D8C8] transition-colors cursor-pointer"
              >
                ⚡ Preenchimento Automático
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-[#2D241E] uppercase mb-1">
                  Rua / Avenida *
                </label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Ex: Rua das Confeitarias"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2D241E] uppercase mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="120"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2D241E] uppercase mb-1">
                Complemento (Opcional)
              </label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apto 42, Bloco C, Próximo à padaria"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#2D241E] uppercase mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Centro"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2D241E] uppercase mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="São Paulo"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-xs sm:text-sm text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>
            </div>

          </div>
        )}

        <div className="sticky bottom-20 md:static z-20">
          <button
            type="submit"
            className="w-full min-h-[50px] py-3.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#8C482A]/20 transition-transform active:scale-98 cursor-pointer"
          >
            <span>Revisar resumo do pedido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
