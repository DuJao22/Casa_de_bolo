import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminOrders } from './admin/AdminOrders';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCategories } from './admin/AdminCategories';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminReviews } from './admin/AdminReviews';
import { AdminSettings } from './admin/AdminSettings';
import { AdminCodeExplorer } from './admin/AdminCodeExplorer';
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  FolderTree,
  Users,
  Star,
  Settings,
  Code2,
  ArrowLeft,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { setActiveView, avaliacoes, adminAutenticado, logoutAdmin } = useStore();
  const [tabAtiva, setTabAtiva] = useState<string>('dashboard');

  // Se o admin não estiver autenticado com dujao / 30031936, exige o login
  if (!adminAutenticado) {
    return <AdminLogin />;
  }

  const pendentesCount = avaliacoes.filter(a => a.status === 'pendente').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    { id: 'produtos', label: 'Produtos', icon: Cake },
    { id: 'categorias', label: 'Categorias', icon: FolderTree },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'avaliacoes', label: 'Avaliações', icon: Star, badge: pendentesCount > 0 ? pendentesCount : undefined },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'codigo', label: 'Código Python / Flask', icon: Code2 }
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Sub-Header Administrativo */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D9] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('catalogo')}
              className="p-2 rounded-xl border border-[#E8E2D9] text-[#7E7267] hover:text-[#8C482A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              title="Voltar para a Loja do Cliente"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C482A] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#E8D8C8]">
                  Painel da Confeitaria
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>dujao</span>
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-[#2D241E] mt-0.5">
                Administração Casa de Bolos
              </h2>
            </div>
          </div>

          {/* Botão Sair do Admin */}
          <button
            onClick={() => {
              logoutAdmin();
              setActiveView('catalogo');
            }}
            className="md:hidden min-h-[38px] px-3 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Encerrar sessão de admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>

        {/* Abas de Navegação Admin & Botão Logout */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isAtivo = tabAtiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTabAtiva(item.id)}
                className={`min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isAtivo
                    ? 'bg-[#8C482A] text-white shadow-xs'
                    : 'text-[#7E7267] hover:text-[#2D241E] hover:bg-[#FAF7F2]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-[#2D241E]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              logoutAdmin();
              setActiveView('catalogo');
            }}
            className="hidden md:flex min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap items-center gap-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer shrink-0 ml-2"
            title="Encerrar sessão de admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair (dujao)</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico da Aba Selecionada */}
      {tabAtiva === 'dashboard' && <AdminDashboard onNavigateTab={setTabAtiva} />}
      {tabAtiva === 'pedidos' && <AdminOrders />}
      {tabAtiva === 'produtos' && <AdminProducts />}
      {tabAtiva === 'categorias' && <AdminCategories />}
      {tabAtiva === 'clientes' && <AdminCustomers />}
      {tabAtiva === 'avaliacoes' && <AdminReviews />}
      {tabAtiva === 'configuracoes' && <AdminSettings />}
      {tabAtiva === 'codigo' && <AdminCodeExplorer />}

    </div>
  );
};
