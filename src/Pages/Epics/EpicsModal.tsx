import { EpicDetails } from "@/Pages/Epics/EpicDetails";
import { Epic } from "@/Types/Epic";
import { Member } from "@/Types/Member";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom"; //separate modal from DOM hierarch (the main app) to prevent z-index and overflow issues

type EpicsModalProps = {
  epic: Epic | null;
  onClose: () => void;
  onUpdate: (data: Partial<Epic>) => void;
  members: Member[];
  loadingMembers: boolean;
};

export default function EpicsModal({ epic, onClose, onUpdate }: EpicsModalProps) {
  if (!epic) return null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // prevent closing modal when click inside modal content.
        className="bg-white relative w-full max-w-3xl mx-4 rounded-xl p-6 shadow-xl"
      >
        <EpicDetails epic={epic} onUpdate={onUpdate} />
      </motion.div>
    </div>,

    document.getElementById("modal-root")!
  );
}
