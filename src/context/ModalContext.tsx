'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle, Info } from 'lucide-react';

export type ModalType = 'info' | 'success' | 'warning' | 'danger' | 'confirm';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface AlertOptions {
  title: string;
  message: string;
  buttonText?: string;
  type?: ModalType;
  onClose?: () => void;
}

interface ModalContextType {
  confirm: (options: ConfirmOptions) => void;
  alert: (options: AlertOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [confirmConfig, setConfirmConfig] = useState<ConfirmOptions | null>(null);
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmConfig(options);
  }, []);

  const alert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
  }, []);

  const handleConfirmSubmit = async () => {
    if (!confirmConfig) return;
    try {
      setIsSubmitting(true);
      await confirmConfig.onConfirm();
      setConfirmConfig(null);
    } catch (err) {
      console.error('Error during modal confirm action:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCancel = () => {
    if (confirmConfig?.onCancel) {
      confirmConfig.onCancel();
    }
    setConfirmConfig(null);
  };

  const handleAlertClose = () => {
    if (alertConfig?.onClose) {
      alertConfig.onClose();
    }
    setAlertConfig(null);
  };

  const renderIcon = (type: ModalType = 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-[#10b982]" size={24} />;
      case 'danger':
        return <AlertCircle className="text-rose-500" size={24} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={24} />;
      case 'confirm':
        return <HelpCircle className="text-blue-500" size={24} />;
      default:
        return <Info className="text-[#10b982]" size={24} />;
    }
  };

  return (
    <ModalContext.Provider value={{ confirm, alert }}>
      {children}

      {/* Reusable Confirm Dialog */}
      {confirmConfig && (
        <Modal
          isOpen={true}
          onClose={handleConfirmCancel}
          maxWidth="sm"
          closeOnBackdrop={!isSubmitting}
        >
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
              {renderIcon(confirmConfig.type || 'warning')}
            </div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-tight mb-2">
              {confirmConfig.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
              {confirmConfig.message}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmCancel}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
              >
                {confirmConfig.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  confirmConfig.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#10b982] hover:bg-emerald-600'
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  confirmConfig.confirmText || 'Confirm'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reusable Alert Dialog */}
      {alertConfig && (
        <Modal
          isOpen={true}
          onClose={handleAlertClose}
          maxWidth="sm"
        >
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
              {renderIcon(alertConfig.type || 'info')}
            </div>
            <h3 className="text-base font-extrabold text-slate-100 tracking-tight mb-2">
              {alertConfig.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
              {alertConfig.message}
            </p>

            <button
              type="button"
              onClick={handleAlertClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#10b982] hover:bg-emerald-600 transition-colors"
            >
              {alertConfig.buttonText || 'OK'}
            </button>
          </div>
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

