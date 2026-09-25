import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Phone, MapPin, ArrowRight } from 'lucide-react';

export const ClientRegistration: React.FC = () => {
  const { cadastrarCliente, setActiveView, carrinho } = useStore();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  // Máscara brasileira de telefone
  const formatPhone = (val: string) => {
    let digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 10) {
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (digits.length > 6) {
      return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (digits.length > 2) {
      return digits.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (digits.length > 0) {
      return `(${digits}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim()) return;

    cadastrarCliente({
      nome,
      telefone,
      endereco,
      numero,
      complemento,
      bairro,
      cidade
    });

    if (carrinho.length > 0) {
      setActiveView('entrega');
    } else {
      setActiveView('catalogo');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-1.5">
          <span className="text-3xl block">👋</span>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Cadastro de Cliente
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267]">
            Cadastre-se rapidamente para fazer seus pedidos na confeitaria.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="reg-nome" className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-1.5">
              Seu Nome Completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E7267]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="reg-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Ana Paula da Silva"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none focus:ring-2 focus:ring-[#8C482A]/15"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-telefone" className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-1.5">
              Telefone / WhatsApp *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E7267]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="reg-telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(11) 98765-4321"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none focus:ring-2 focus:ring-[#8C482A]/15 tabular-nums"
              />
            </div>
          </div>

          {/* Endereço (opcional no cadastro, pode ser preenchido na entrega) */}
          <div className="pt-2 border-t border-[#E8E2D9] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7E7267]">
              <MapPin className="w-3.5 h-3.5 text-[#8C482A]" />
              <span>Endereço Padrão (Opcional)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua / Avenida"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-base sm:text-xs text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Nº"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-base sm:text-xs text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apto / Bloco"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-base sm:text-xs text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
              />
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Bairro"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-base sm:text-xs text-[#2D241E] focus:bg-white focus:border-[#8C482A] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!nome.trim() || telefone.length < 10}
            className="w-full min-h-[48px] mt-4 py-3.5 bg-[#8C482A] hover:bg-[#73371D] disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
          >
            <span>Criar cadastro e ver cardápio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setActiveView('identificacao')}
            className="min-h-[44px] text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] underline inline-flex items-center cursor-pointer"
          >
            Já tem cadastro? Entrar com telefone
          </button>
        </div>

      </div>
    </div>
  );
};
