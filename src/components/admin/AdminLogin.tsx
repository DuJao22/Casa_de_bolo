import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setActiveView } = useStore();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!usuario.trim() || !senha.trim()) {
      setErro('Por favor, informe o usuário e a senha.');
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      const sucesso = loginAdmin(usuario, senha);
      if (!sucesso) {
        setErro('Usuário ou senha incorretos. Verifique suas credenciais de acesso.');
        setCarregando(false);
      }
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header com ícone de segurança */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] text-[#8C482A] flex items-center justify-center mx-auto border border-[#E8D8C8] shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2D241E]">
            Acesso Administrativo
          </h1>
          <p className="text-xs sm:text-sm text-[#7E7267] max-w-xs mx-auto leading-relaxed">
            Área restrita para gestão de pedidos, cardápio, estoque e clientes.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo de Usuário */}
          <div>
            <label 
              htmlFor="admin-usuario"
              className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-1.5"
            >
              Usuário / Login *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E7267]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="admin-usuario"
                type="text"
                value={usuario}
                onChange={(e) => {
                  setUsuario(e.target.value);
                  setErro(null);
                }}
                placeholder="Ex: dujao"
                required
                autoFocus
                autoCapitalize="none"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] placeholder-[#7E7267]/50 focus:bg-white focus:border-[#8C482A] focus:outline-none focus:ring-2 focus:ring-[#8C482A]/15"
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label 
              htmlFor="admin-senha"
              className="block text-xs font-bold uppercase tracking-wider text-[#2D241E] mb-1.5"
            >
              Senha de Acesso *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E7267]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro(null);
                }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-xl text-sm font-medium text-[#2D241E] placeholder-[#7E7267]/50 focus:bg-white focus:border-[#8C482A] focus:outline-none focus:ring-2 focus:ring-[#8C482A]/15"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7E7267] hover:text-[#2D241E] cursor-pointer"
                title={mostrarSenha ? 'Ocultar senha' : 'Ver senha'}
              >
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botão de Entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full min-h-[48px] py-3 px-4 bg-[#8C482A] hover:bg-[#73371D] disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer mt-2"
          >
            <span>{carregando ? 'Validando...' : 'Acessar Painel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Voltar para a Loja */}
        <div className="pt-2 text-center border-t border-[#E8E2D9]">
          <button
            type="button"
            onClick={() => setActiveView('catalogo')}
            className="min-h-[40px] text-xs font-semibold text-[#7E7267] hover:text-[#8C482A] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Cardápio da Loja</span>
          </button>
        </div>

      </div>
    </div>
  );
};
