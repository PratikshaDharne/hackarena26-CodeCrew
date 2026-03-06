import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && <ChatWindow onClose={() => setOpen(false)} />}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center 
        bg-gradient-to-r from-green-500 to-teal-500 
        text-white shadow-xl z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </>
  );
};

export default ChatbotWidget;