import { useState } from "react";
// Tes
export type ModalType = 'info' | 'success' | 'error' | 'warning' | 'debug' | 'process';

export function useModals() {
  const [modals, setModals] = useState<{
    show: boolean;
    type: ModalType;
    message: string | null;
  }>({ show: false, type: 'info', message: null });

  const showModal = (type: ModalType, message?: string, duration = 3000) => {
    setModals({ show: true, type, message: message || null });

    if (duration > 0) {
      setTimeout(() => {
        setModals(prev => ({ ...prev, show: false }));
      }, duration);
    }
  };

  return {
    modals,
    modalsInfo: (msg?: string, duration?: number) => showModal('info', msg, duration),
    modalsSuccess: (msg?: string, duration?: number) => showModal('success', msg, duration),
    modalsError: (msg?: string, duration?: number) => showModal('error', msg, duration),
    modalsWarning: (msg?: string, duration?: number) => showModal('warning', msg, duration),
    modalsDebug: (msg?: string, duration?: number) => showModal('debug', msg, duration),
    modalsProcess: (msg?: string, duration?: number) => showModal('process', msg, duration || 0), // manual dismiss
    closeModal: () => setModals(prev => ({ ...prev, show: false })),
  };
}
