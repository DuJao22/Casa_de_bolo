import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, UserPlus, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ClientIdentification: React.FC = () => {
  const { identificarPorTelefone, setActiveView } = useStore();
  const [telefone, setTelefone] = useState('(11) 98765-1111');
  const [mensagemEncontrado, setMensagemEncontrado] = useState<string | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [opcaoInicial, setOpcaoInicial] = useState<'pergunta' | 'busca'>('pergunta');

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

  const handlePreencherAutomatico = () => {
    const tel = '(11) 98765-1111';
    setTelefone(tel);
    const cliente = identificarPorTelefone(tel);
    if (cliente) {
      setMensagemEncontrado(`Olá, ${cliente.nome}! 🍰 Preenchimento automático ativado.`);
      setNaoEncontrado(false);
      setTimeout(() => {
        setActiveView('catalogo');
      }, 700);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value));
    setMensagemEncontrado(null);
    setNaoEncontrado(false);
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefone.trim()) return;

    const cliente = identificarPorTelefone(telefone);
    if (cliente) {
      setMensagemEncontrado(`Olá, ${cliente.nome}! 👋 Que bom ter você de volta.`);
      setNaoEncontrado(false);
      setTimeout(() => {
        setActiveView('catalogo');
      }, 1200);
    } else {
      setNaoEncontrado(true);
      setMensagemEncontrado(null);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {opcaoInicial === 'pergunta' ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#8C482A] flex items-center justify-center mx-auto text-2xl">
              🍰
            </div>

            <div>
              <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
                Vamos começar seu pedido
              </h1>
              <p className="text-sm text-[#7E7267] mt-1.5">
                Você já fez pedidos conosco anteriormente?
              </p>
            </div>

            {/* Botão de Preenchimento Automático Rápido */}
            <div className="bg-[#FAF0E6] border border-[#E8D8C8] rounded-xl p-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C482A] tracking-wider block">
                    ⚡ Preenchimento Automático
                  </span>
                  <p className="text-xs text-[#2D241E] font-semibold mt-0.5">
                    João da Silva · (11) 98765-1111
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePreencherAutomatico}
                  className="px-3 py-1.5 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-lg text-xs font-bold shrink-0 transition-transform active:scale-95 cursor-pointer"
                >
                  Entrar Direto →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setOpcaoInicial('busca')}
                className="p-4 rounded-xl border-2 border-[#8C482A] bg-[#FAF0E6] text-[#8C482A] font-semibold text-sm hover:bg-[#8C482A] hover:text-white transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span className="text-lg font-bold">SIM</span>
                <span className="text-xs opacity-80">Já sou cliente</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('cadastro')}
                className="p-4 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-[#2D241E] font-semibold text-sm hover:border-[#8C482A] transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span className="text-lg font-bold">NÃO</span>
                <span className="text-xs text-[#7E7267]">Primeiro pedido</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#E8E2D9]">
              <button
                type="button"
                onClick={() => setActiveView('catalogo')}
                className="text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] underline"
              >
                Apenas olhar o cardápio sem entrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBuscar} className="space-y-6">
            
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setOpcaoInicial('pergunta')}
                className="min-h-[44px] text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] mb-1 inline-flex items-center gap-1 cursor-pointer"
              >
                ← Voltar
              </button>
              <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
                Identifique seu cadastro
              </h1>
              <p className="text-xs sm:text-sm text-[#7E7267]">
                Informe o número de WhatsApp cadastrado na loja.
              </p>
            </div>

            {/* Mensagem de sucesso ao encontrar */}
            {mensagemEncontrado && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium">{mensagemEncontrado}</span>
              </div>
            )}

            {/* Aviso quando não encontra */}
            {naoEncontrado && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Parece que é seu primeiro pedido por aqui.</p>
                    <p className="text-amber-800 text-xs mt-0.5">
                      Não localizamos este telefone. Vamos fazer seu cadastro rapidinho!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('cadastro')}
                  className="w-full min-h-[44px] py-2.5 bg-[#8C482A] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Criar meu cadastro agora</span>
                </button>
              </div>
            )}

            <div>
              <label htmlFor="telefone" className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-2">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E7267]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 98765-4321"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-base font-medium text-[#2D241E] placeholder-[#7E7267]/60 focus:bg-white focus:border-[#8C482A] focus:outline-none focus:ring-2 focus:ring-[#8C482A]/15 tabular-nums"
                />
              </div>
              <p className="text-[11px] text-[#7E7267] mt-1.5">
                Exemplo: (11) 98765-1111 (Cliente de teste)
              </p>
            </div>

            <button
              type="submit"
              disabled={telefone.length < 10}
              className="w-full min-h-[48px] py-3.5 bg-[#8C482A] hover:bg-[#73371D] disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveView('cadastro')}
                className="min-h-[44px] text-xs font-semibold text-[#8C482A] hover:underline inline-flex items-center cursor-pointer"
              >
                Não tenho cadastro. Criar novo cadastro →
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
