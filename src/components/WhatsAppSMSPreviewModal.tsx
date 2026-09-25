import React, { useState } from 'react';
import { Notificacao } from '../types';
import { X, MessageCircle, Send, Check, Phone, Code, Sparkles, Copy } from 'lucide-react';

interface WhatsAppSMSPreviewModalProps {
  notificacao: Notificacao | null;
  onClose: () => void;
}

export const WhatsAppSMSPreviewModal: React.FC<WhatsAppSMSPreviewModalProps> = ({
  notificacao,
  onClose
}) => {
  const [canalAtivo, setCanalAtivo] = useState<'whatsapp' | 'sms' | 'webhook'>('whatsapp');
  const [copiado, setCopiado] = useState(false);
  const [disparando, setDisparando] = useState(false);
  const [disparadoSucesso, setDisparadoSucesso] = useState(false);

  if (!notificacao) return null;

  const telefone = notificacao.whatsapp_preview?.telefone || '(11) 98765-1111';
  const textoWhatsApp = notificacao.whatsapp_preview?.texto || notificacao.mensagem;
  const textoSMS = notificacao.sms_preview?.texto || notificacao.mensagem;

  const webhookPayload = {
    event: 'order.status_updated',
    timestamp: new Date().toISOString(),
    channel: canalAtivo,
    recipient: {
      phone: telefone.replace(/\D/g, ''),
      formatted_phone: telefone,
      name: notificacao.cliente_nome || 'Cliente'
    },
    order: {
      id: notificacao.pedido_id || 1042,
      notification_id: notificacao.id,
      title: notificacao.titulo,
      message: notificacao.mensagem
    },
    gateway_config: {
      provider: canalAtivo === 'whatsapp' ? 'WhatsApp Business Cloud API / Z-API / Evolution' : 'Twilio / TotalVoice',
      status: 'queued'
    }
  };

  const handleCopiarPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(webhookPayload, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleSimularDisparo = () => {
    setDisparando(true);
    setTimeout(() => {
      setDisparando(false);
      setDisparadoSucesso(true);
      setTimeout(() => setDisparadoSucesso(false), 3000);
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#FFFFFF] rounded-t-3xl sm:rounded-2xl border border-[#E8E2D9] w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="w-12 h-1.5 bg-[#D8D0C5] rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Topo */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D9] bg-[#FAF7F2] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C482A] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#E8D8C8]">
              Gateway de Notificações
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D241E] mt-0.5">
              Disparo para WhatsApp & SMS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#7E7267] hover:text-[#2D241E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abas de Canal */}
        <div className="px-4 sm:px-5 pt-2 border-b border-[#E8E2D9] flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCanalAtivo('whatsapp')}
            className={`min-h-[44px] pb-2 sm:pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              canalAtivo === 'whatsapp'
                ? 'border-[#25D366] text-[#128C7E]'
                : 'border-transparent text-[#7E7267] hover:text-[#2D241E]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Business</span>
          </button>

          <button
            onClick={() => setCanalAtivo('sms')}
            className={`min-h-[44px] pb-2 sm:pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              canalAtivo === 'sms'
                ? 'border-[#8C482A] text-[#8C482A]'
                : 'border-transparent text-[#7E7267] hover:text-[#2D241E]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>SMS Gateway</span>
          </button>

          <button
            onClick={() => setCanalAtivo('webhook')}
            className={`min-h-[44px] pb-2 sm:pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              canalAtivo === 'webhook'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-[#7E7267] hover:text-[#2D241E]'
            }`}
          >
            <Code className="w-4 h-4 text-blue-600" />
            <span>Payload Webhook / API</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {canalAtivo === 'whatsapp' && (
            <div className="space-y-3">
              <div className="text-xs text-[#7E7267] flex items-center justify-between">
                <span>Destinatário: <strong className="text-[#2D241E]">{telefone}</strong></span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Pronto para Envio
                </span>
              </div>

              {/* Balão estilizado de WhatsApp */}
              <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-[#D1D7DB] relative shadow-inner">
                <div className="bg-[#FFFFFF] p-3.5 rounded-2xl rounded-tl-xs shadow-xs max-w-sm text-xs sm:text-sm text-[#111B21] space-y-1.5 border border-[#E8E2D9]">
                  <p className="whitespace-pre-line leading-relaxed">
                    {textoWhatsApp}
                  </p>
                  <div className="text-[10px] text-[#667781] text-right">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(textoWhatsApp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir Conversa no WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleSimularDisparo}
                  disabled={disparando}
                  className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#FAF0E6] text-[#2D241E] border border-[#E8E2D9] rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {disparando ? (
                    <span>Disparando...</span>
                  ) : disparadoSucesso ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Disparado!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Simular API</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {canalAtivo === 'sms' && (
            <div className="space-y-3">
              <div className="text-xs text-[#7E7267] flex items-center justify-between">
                <span>Número: <strong className="text-[#2D241E]">{telefone}</strong></span>
                <span className="text-[#8C482A] font-semibold bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#E8D8C8]">
                  GSM 7-bit (160 caracteres)
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D9] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7E7267] block">
                  Mensagem SMS Formatada:
                </span>
                <p className="font-mono text-xs text-[#2D241E] bg-white p-3 rounded-lg border border-[#E8E2D9]">
                  {textoSMS}
                </p>
                <div className="flex justify-between text-[11px] text-[#7E7267]">
                  <span>Caracteres: {textoSMS.length} / 160</span>
                  <span>1 SMS Tarifado</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimularDisparo}
                disabled={disparando}
                className="w-full min-h-[44px] py-2.5 px-4 bg-[#8C482A] hover:bg-[#73371D] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                {disparando ? (
                  <span>Enviando SMS...</span>
                ) : disparadoSucesso ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SMS Enviado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Simular Disparo via SMS Gateway</span>
                  </>
                )}
              </button>
            </div>
          )}

          {canalAtivo === 'webhook' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7E7267]">
                  Payload pronto para integração (Twilio / Z-API / Evolution / Webhooks):
                </span>
                <button
                  type="button"
                  onClick={handleCopiarPayload}
                  className="min-h-[44px] px-2 text-xs text-[#8C482A] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? 'Copiado!' : 'Copiar JSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#1E1E1E] text-[#D4D4D4] rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(webhookPayload, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Rodapé Informativo */}
        <div className="p-3.5 bg-[#FAF7F2] border-t border-[#E8E2D9] text-[11px] text-[#7E7267] flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#8C482A] shrink-0" />
            <span className="truncate">Estrutura desacoplada e escalável.</span>
          </span>
          <button
            onClick={onClose}
            className="min-h-[40px] px-4 py-1.5 bg-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#2D241E] hover:bg-[#FAF7F2] shrink-0 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
