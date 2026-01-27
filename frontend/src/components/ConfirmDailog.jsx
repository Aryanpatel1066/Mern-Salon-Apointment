import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDialog = ({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // danger | primary | warning
  loading = false,
  onConfirm,
  onCancel,
  children,
}) => {
  const cancelRef = useRef(null);

  // 🔒 Lock background scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ⌨️ ESC + Enter support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter" && !loading) onConfirm();
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      cancelRef.current?.focus();
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel, onConfirm]);

  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  const variants = {
    danger: "bg-red-500 hover:bg-red-600",
    primary: "bg-pink-600 hover:bg-pink-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onCancel : undefined}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h2>

              <p className="text-gray-600 mb-4">{message}</p>

              {children && (
                <div className="text-sm text-gray-500 mb-4">{children}</div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  ref={cancelRef}
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {cancelText}
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white disabled:opacity-70 flex items-center gap-2 ${variants[variant]}`}
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
