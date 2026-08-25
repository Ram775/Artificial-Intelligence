import React from "react";
import { useChatContext } from "../../context/ChatContext";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatContainer = () => {
  const { isLoading } = useChatContext();

  return (
    <main
      className="
        relative
        flex
        flex-col
        w-full
        h-[100dvh]
        overflow-hidden
        bg-slate-50
      "
    >
      {/* Ambient background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -top-40
            -right-40
            w-[420px]
            h-[420px]
            rounded-full
            bg-indigo-500/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            w-[420px]
            h-[420px]
            rounded-full
            bg-violet-500/[0.035]
            blur-3xl
          "
        />
      </div>

      {/* Header */}
      <ChatHeader />

      {/* Messages */}
      <section
        className="
          relative
          flex-1
          min-h-0
          overflow-x-hidden
          overflow-y-auto
        "
      >
        <ChatMessages />
      </section>

      {/* Input */}
      <ChatInput disabled={isLoading} />
    </main>
  );
};

export default ChatContainer;