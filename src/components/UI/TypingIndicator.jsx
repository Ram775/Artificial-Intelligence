import React from "react";

const TypingIndicator = () => {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
        px-1
        py-1
      "
      aria-label="Shree AI is typing"
    >
      {[0, 1, 2].map((delay) => (
        <span
          key={delay}
          className="
            relative
            w-1.5
            h-1.5
            md:w-2
            md:h-2
            rounded-full
            bg-gradient-to-br
            from-indigo-500
            to-violet-500
            shadow-[0_1px_5px_rgba(99,102,241,0.25)]
            animate-bounce
          "
          style={{
            animationDelay: `${delay * 140}ms`,
            animationDuration: "900ms",
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;