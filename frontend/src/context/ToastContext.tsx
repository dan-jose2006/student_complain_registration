import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message, title }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback((msg: string, title?: string) => addToast(msg, 'success', title), [addToast]);
  const error = useCallback((msg: string, title?: string) => addToast(msg, 'error', title), [addToast]);
  const warning = useCallback((msg: string, title?: string) => addToast(msg, 'warning', title), [addToast]);
  const info = useCallback((msg: string, title?: string) => addToast(msg, 'info', title), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full px-4">
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md bg-card/95 text-card-foreground border-border/80"
            >
              <div className="mt-0.5 shrink-0">
                {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {item.type === 'error' && <XCircle className="w-5 h-5 text-rose-500" />}
                {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {item.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1 text-sm">
                {item.title && <div className="font-semibold text-foreground">{item.title}</div>}
                <div className="text-muted-foreground leading-relaxed">{item.message}</div>
              </div>
              <button
                onClick={() => removeToast(item.id)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
