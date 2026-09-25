/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { ClientHome } from './components/ClientHome';
import { ClientIdentification } from './components/ClientIdentification';
import { ClientRegistration } from './components/ClientRegistration';
import { ClientCatalog } from './components/ClientCatalog';
import { ClientCart } from './components/ClientCart';
import { ClientDelivery } from './components/ClientDelivery';
import { ClientSummary } from './components/ClientSummary';
import { ClientConfirmed } from './components/ClientConfirmed';
import { AdminLayout } from './components/AdminLayout';
import { NotificationToast } from './components/NotificationToast';
import { ReviewOrderModal } from './components/ReviewOrderModal';
import { MobileBottomNav } from './components/MobileBottomNav';

function AppContent() {
  const { activeView, setActiveView, config } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D241E]">
      <NotificationToast />
      <ReviewOrderModal />
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-4 pt-4 sm:pt-6 pb-24 md:pb-8">
        {activeView === 'home' && <ClientHome />}
        {activeView === 'identificacao' && <ClientIdentification />}
        {activeView === 'cadastro' && <ClientRegistration />}
        {activeView === 'catalogo' && <ClientCatalog />}
        {activeView === 'carrinho' && <ClientCart />}
        {activeView === 'entrega' && <ClientDelivery />}
        {activeView === 'resumo' && <ClientSummary />}
        {activeView === 'confirmado' && <ClientConfirmed />}
        {activeView === 'admin' && <AdminLayout />}
      </main>

      <MobileBottomNav />

      <footer className="bg-[#FFFFFF] border-t border-[#E8E2D9] py-8 pb-24 md:pb-8 text-center text-xs text-[#7E7267] mt-auto">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="font-serif text-lg font-bold text-[#8C482A]">
            {config.nome}
          </div>
          <p className="max-w-md mx-auto text-[#7E7267]">
            Bolos feitos com carinho para deixar seu dia mais especial. Receitas artesanais tradicionais assadas todos os dias.
          </p>
          <div className="pt-2 text-[11px] text-[#7E7267]/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>Atendimento: {config.telefone}</span>
            <span>·</span>
            <span>{config.endereco}</span>
          </div>
          <div className="pt-3 border-t border-[#E8E2D9]/60 flex items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveView('catalogo')}
              className="hover:text-[#8C482A] underline cursor-pointer"
            >
              Cardápio Online
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveView('admin')}
              className="text-[#8C482A] font-semibold underline cursor-pointer"
            >
              Painel Administrativo (/admin)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
