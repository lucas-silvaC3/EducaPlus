import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  reduceMotion?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
  reduceMotion = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.05 : 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.92, y: reduceMotion ? 0 : 20 }}
            transition={{ duration: reduceMotion ? 0.05 : 0.22, ease: 'easeOut' }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            className="fixed z-50 rounded-2xl p-6 shadow-2xl"
            style={{
              background: 'white',
              width: 'min(90vw, 360px)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: destructive ? '#FEE2E2' : '#EDE9FE' }}
              >
                <AlertTriangle size={28} color={destructive ? '#EF4444' : '#7C3AED'} />
              </div>

              <div className="text-center">
                <h3 id="confirm-title" style={{ color: '#1E1B4B', marginBottom: 8 }}>
                  {title}
                </h3>
                <p id="confirm-desc" style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                  {description}
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-xl py-2.5 transition-all"
                  style={{
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 rounded-xl py-2.5 transition-all"
                  style={{
                    background: destructive ? '#EF4444' : '#7C3AED',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
