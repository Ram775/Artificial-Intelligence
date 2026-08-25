import React from "react";
import { useChatContext } from "../../context/ChatContext";
import { Bot, Trash2, Sparkles, Wifi, LoaderCircle } from "lucide-react";

const ChatHeader = () => {
  const { clearMessages, isLoading } = useChatContext();

  return (
    <header className="sticky top-0 z-30 w-full flex-shrink-0">
      {/* Soft background blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60" />

      <div className="relative flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* AI Logo */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-purple-500/20 blur-md" />

            <div
              className="
                relative
                w-10 h-10 md:w-11 md:h-11
                rounded-full
               
                flex items-center justify-center
                shadow-[0_8px_24px_-8px_rgba(79,70,229,0.65)]
                ring-1 ring-white/70
              "
            >
              <img
                src="/images/logo3.jpg"
                alt="AI Logo"
                className="rounded-full h-10 w-10 bg-cover"
              />
            </div>

            {/* Sparkle */}
            {/* <div
              className="
                absolute -right-1.5 -top-1.5
                w-5 h-5
                rounded-full
                bg-white
                border border-slate-100
                shadow-sm
                flex items-center justify-center
              "
            >
              <Sparkles size={11} className="text-amber-500 fill-amber-400" />
            </div> */}
          </div>

          {/* Name + Status */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] md:text-[16px] font-bold text-slate-900 tracking-tight truncate">
                Shree AI
              </h1>

              <span
                className="
                  hidden sm:inline-flex
                  items-center
                  rounded-full
                  bg-indigo-50
                  px-2 py-0.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-indigo-600
                  border border-indigo-100
                "
              >
                AI
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {isLoading ? (
                <>
                  <LoaderCircle
                    size={11}
                    className="text-indigo-500 animate-spin"
                  />

                  <span className="text-[11px] md:text-xs font-medium text-slate-500">
                    Thinking...
                  </span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-[11px] md:text-xs font-medium text-slate-500">
                    Online
                  </span>

                  <span className="hidden sm:inline text-slate-300">•</span>

                  <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                    <Wifi size={10} />
                    Ready to help
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={clearMessages}
          disabled={isLoading}
          title="Clear chat"
          className="
            group
            flex items-center gap-2
            h-9
            px-2.5 md:px-3
            rounded-xl
            text-slate-500
            bg-white/60
            border border-slate-200/70
            shadow-sm
            hover:bg-rose-50
            hover:text-rose-600
            hover:border-rose-200
            hover:shadow-md
            active:scale-[0.97]
            transition-all duration-200
            disabled:opacity-40
            disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <Trash2
            size={16}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:scale-110"
          />

          <span className="hidden md:inline text-xs font-semibold">
            Clear chat
          </span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
