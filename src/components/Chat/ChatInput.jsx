import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import {
  Send,
  Sparkles,
  ArrowUp,
} from "lucide-react";

const ChatInput = ({ disabled }) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { sendChatMessage } = useChatContext();
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      const maxHeight = 140;
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const message = input.trim();

    if (!message || disabled) return;

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendChatMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = Boolean(input.trim() && !disabled);

  return (
    <div className="sticky bottom-0 z-30 flex-shrink-0 w-full">
      
      {/* Background */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border-t border-slate-200/60" />

      <div className="relative px-3 pt-3 pb-2.5 md:px-6 md:pt-4 md:pb-3">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto"
        >
          {/* Composer */}
          <div
            className={`
              relative
              flex
              items-end
              gap-2
              rounded-[22px]
              p-1.5
              md:p-2
              bg-white
              border
              transition-all
              duration-300
              ${
                isFocused
                  ? `
                    border-indigo-300
                    shadow-[0_12px_40px_-12px_rgba(79,70,229,0.22)]
                    ring-4 ring-indigo-500/10
                  `
                  : `
                    border-slate-200
                    shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)]
                    hover:border-slate-300
                    hover:shadow-[0_8px_28px_-10px_rgba(15,23,42,0.15)]
                  `
              }
            `}
          >
            {/* Small AI icon */}
            <div
              className="
                hidden sm:flex
                flex-shrink-0
                items-center
                justify-center
                w-9 h-9
                mb-0.5
                rounded-xl
                bg-gradient-to-br
                from-indigo-50
                to-violet-50
                border border-indigo-100/70
              "
            >
              <Sparkles
                size={16}
                className="text-indigo-500"
              />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              rows={1}
              placeholder={
                disabled
                  ? "Shree AI is thinking..."
                  : "Message Shree AI..."
              }
              className="
                flex-1
                min-w-0
                bg-transparent
                border-0
                outline-none
                resize-none
                max-h-[140px]
                min-h-[38px]
                px-2
                py-2.5
                md:px-3
                md:py-2.5
                text-[13px]
                md:text-sm
                leading-relaxed
                text-slate-800
                placeholder:text-slate-400
                disabled:opacity-50
                disabled:cursor-not-allowed
                custom-scrollbar
              "
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              title={canSend ? "Send message" : "Type a message"}
              className={`
                group
                flex
                flex-shrink-0
                items-center
                justify-center
                w-9 h-9
                md:w-10 md:h-10
                mb-0.5
                rounded-xl
                transition-all
                duration-200
                ${
                  canSend
                    ? `
                      bg-gradient-to-br
                      from-indigo-600
                      via-violet-600
                      to-purple-600
                      text-white
                      shadow-[0_6px_18px_-5px_rgba(79,70,229,0.55)]
                      hover:shadow-[0_8px_24px_-5px_rgba(79,70,229,0.65)]
                      hover:-translate-y-0.5
                      active:scale-90
                      cursor-pointer
                    `
                    : `
                      bg-slate-100
                      text-slate-300
                      cursor-not-allowed
                    `
                }
              `}
            >
              <ArrowUp
                size={18}
                strokeWidth={2.5}
                className={`
                  transition-transform duration-200
                  ${
                    canSend
                      ? "group-hover:-translate-y-0.5"
                      : ""
                  }
                `}
              />
            </button>
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center gap-1.5">
              <Sparkles
                size={10}
                className="text-indigo-400"
              />

              <span className="text-[9px] md:text-[10px] font-medium text-slate-400">
                AI-powered
              </span>
            </div>

            <span className="text-slate-300 text-[9px]">
              •
            </span>

            <span className="text-[9px] md:text-[10px] text-slate-400">
              Enter to send
            </span>

            <span className="hidden sm:inline text-slate-300 text-[9px]">
              •
            </span>

            <span className="hidden sm:inline text-[9px] md:text-[10px] text-slate-400">
              Shift + Enter for new line
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;