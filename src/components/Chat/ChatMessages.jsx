import React, { useRef, useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "../UI/TypingIndicator";
import { Bot, Sparkles, MessageCircle } from "lucide-react";

const ChatMessages = () => {
  const { messages, isLoading } = useChatContext();
  const messagesEndRef = useRef(null);

  /* -----------------------------
     Auto Scroll
  ------------------------------ */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  /* -----------------------------
     Empty State
  ------------------------------ */

  if (!messages || messages.length === 0) {
    return (
      <div className="relative flex-1 overflow-hidden">
        {/* Soft background glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-[280px]
            md:w-[420px]
            h-[280px]
            md:h-[420px]
            rounded-full
            bg-indigo-500/[0.045]
            blur-3xl
          "
        />

        <div
          className="
            relative
            h-full
            flex
            items-center
            justify-center
            px-5
            py-10
          "
        >
          <div className="w-full max-w-md text-center">
            {/* AI Logo */}
            <div className="relative inline-flex mb-5 md:mb-6">
              {/* Glow */}
              <div
                className="
                  absolute
                  -inset-3
                  rounded-[30px]
                  bg-gradient-to-br
                  from-indigo-500/20
                  via-violet-500/10
                  to-purple-500/20
                  blur-xl
                "
              />

              <img
                src="/images/logo3.jpg"
                alt="AI Logo"
                className="rounded-full h-16 w-16 md:h-20 md:w-20 bg-cover"
              />
            </div>

            {/* Sparkle */}
            {/* <div
                className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  items-center
                  justify-center
                  w-7
                  h-7
                  md:w-8
                  md:h-8
                  rounded-full
                  bg-white
                  border
                  border-slate-100
                  shadow-md
                "
              >
                <Sparkles
                  size={13}
                  className="
                    text-amber-400
                    fill-amber-400
                    animate-pulse
                    md:hidden
                  "
                />

                <Sparkles
                  size={15}
                  className="
                    text-amber-400
                    fill-amber-400
                    animate-pulse
                    hidden md:block
                  "
                />
              </div> */}

            {/* Heading */}
            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              How can I help you?
            </h2>

            {/* Description */}
            <p
              className="
                mt-2
                text-xs
                md:text-sm
                leading-relaxed
                text-slate-400
                max-w-[300px]
                mx-auto
              "
            >
              Ask me anything. I'm here to help you learn, create and solve
              problems.
            </p>

            {/* Suggestion Pills */}
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
                mt-6
              "
            >
              {[
                "💡 Ask anything",
                "💻 Help with code",
                "✍️ Write something",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/80
                    border
                    border-slate-200/80
                    text-[10px]
                    md:text-[11px]
                    font-medium
                    text-slate-500
                    shadow-sm
                  "
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Bottom status */}
            <div
              className="
                flex
                items-center
                justify-center
                gap-1.5
                mt-6
                text-[9px]
                md:text-[10px]
                font-medium
                text-slate-400
              "
            >
              <span
                className="
                  relative
                  flex
                  w-1.5
                  h-1.5
                "
              >
                <span
                  className="
                    absolute
                    inline-flex
                    w-full
                    h-full
                    rounded-full
                    bg-emerald-400
                    opacity-40
                    animate-ping
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-emerald-500
                  "
                />
              </span>
              Shree AI is ready
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------
     Messages
  ------------------------------ */

  return (
    <div
      className="
        flex-1
        overflow-y-auto
        scroll-smooth
        custom-scrollbar
        px-3
        md:px-6
        py-4
        md:py-6
      "
    >
      <div
        className="
          w-full
          max-w-4xl
          mx-auto
          space-y-4
          md:space-y-5
        "
      >
        {/* Messages */}
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} message={message} />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-px" />
      </div>
    </div>
  );
};

export default ChatMessages;
