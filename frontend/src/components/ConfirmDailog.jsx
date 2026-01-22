import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDialog = ({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  // ESC key support
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onCancel : undefined}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h2>

              <p className="text-gray-600 mb-6">
                {message}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-70 flex items-center gap-2"
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
