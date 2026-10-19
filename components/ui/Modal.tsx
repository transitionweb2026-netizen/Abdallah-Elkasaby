"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  closeLabel: string;
  children: ReactNode;
  size?: "md" | "lg";
};

/**
 * Shared glass modal (service details, video player, enlarged before/after).
 * A native <dialog> provides focus trapping, Escape handling and an inert
 * page; motion provides the reference's fade + scale entrance and exit.
 */
export function Modal({ open, onClose, label, closeLabel, children, size = "md" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [open]);

  const finishClose = () => {
    const dialog = ref.current;
    if (dialog?.open) dialog.close();
    document.documentElement.style.removeProperty("overflow");
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <AnimatePresence onExitComplete={finishClose}>
        {open && (
          <motion.div
            key="panel"
            className={`glass glass--strong ${styles.panel} ${size === "lg" ? styles.lg : ""}`}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className={`icon-badge icon-badge--round ${styles.close}`} onClick={onClose} autoFocus>
              <X size={20} aria-hidden="true" />
              <span className="visually-hidden">{closeLabel}</span>
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
