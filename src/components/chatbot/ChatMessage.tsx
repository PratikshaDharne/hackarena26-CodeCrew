import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface Props {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: Props) => {
  const isBot = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
        isBot ? "gradient-bg" : "bg-muted"
      }`}>
        {isBot ? <Bot className="w-3.5 h-3.5 text-primary-foreground" /> : <User className="w-3.5 h-3.5 text-foreground" />}
      </div>
      <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
        isBot
          ? "bg-muted/40 text-foreground"
          : "gradient-bg text-primary-foreground"
      }`}>
        {content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1" : ""}>
            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
