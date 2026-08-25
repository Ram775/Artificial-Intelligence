import React from "react";
import {
  User,
  Bot,
  CheckCheck,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

/* -----------------------------
   Inline Markdown
------------------------------ */

const formatInlineSimple = (text) => {
  if (!text) return text;

  const parts = [];
  let currentText = text;
  let codeIndex = currentText.indexOf("`");

  while (codeIndex !== -1) {
    if (codeIndex > 0) {
      parts.push(currentText.substring(0, codeIndex));
    }

    const closeIndex = currentText.indexOf("`", codeIndex + 1);

    if (closeIndex !== -1) {
      const codeContent = currentText.substring(
        codeIndex + 1,
        closeIndex
      );

      parts.push(
        <code
          key={`code-${parts.length}`}
          className="
            px-1.5 py-0.5
            rounded-md
            bg-slate-100
            border border-slate-200
            text-[0.9em]
            font-mono
            text-indigo-600
          "
        >
          {codeContent}
        </code>
      );

      currentText = currentText.substring(closeIndex + 1);
    } else {
      parts.push(currentText.substring(codeIndex));
      currentText = "";
      break;
    }

    codeIndex = currentText.indexOf("`");
  }

  if (currentText) {
    parts.push(currentText);
  }

  return parts.length > 1 ? parts : parts[0] || text;
};

const formatInline = (text) => {
  if (!text) return text;

  const parts = [];
  let currentText = text;
  let boldIndex = currentText.indexOf("**");

  while (boldIndex !== -1) {
    if (boldIndex > 0) {
      parts.push(
        formatInlineSimple(
          currentText.substring(0, boldIndex)
        )
      );
    }

    const closeIndex = currentText.indexOf(
      "**",
      boldIndex + 2
    );

    if (closeIndex !== -1) {
      const boldText = currentText.substring(
        boldIndex + 2,
        closeIndex
      );

      parts.push(
        <strong
          key={`bold-${parts.length}`}
          className="font-semibold text-slate-900"
        >
          {boldText}
        </strong>
      );

      currentText = currentText.substring(closeIndex + 2);
    } else {
      parts.push(
        formatInlineSimple(currentText.substring(boldIndex))
      );

      currentText = "";
      break;
    }

    boldIndex = currentText.indexOf("**");
  }

  if (currentText) {
    parts.push(formatInlineSimple(currentText));
  }

  return parts.length > 1 ? parts : parts[0] || text;
};

/* -----------------------------
   Code Block
------------------------------ */

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div
      className="
        group
        my-3
        overflow-hidden
        rounded-xl
        border border-slate-800/80
        bg-[#0b1120]
        shadow-lg
      "
    >
      {/* Code Header */}
      <div
        className="
          flex
          items-center
          justify-between
          px-3
          py-2
          bg-slate-900
          border-b border-white/10
        "
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400/80" />
            <span className="w-2 h-2 rounded-full bg-amber-400/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          </div>

          <span className="ml-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {language || "code"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="
            flex
            items-center
            gap-1.5
            px-2
            py-1
            rounded-md
            text-[10px]
            font-medium
            text-slate-400
            hover:text-white
            hover:bg-white/10
            transition-all
            cursor-pointer
          "
        >
          {copied ? (
            <>
              <Check size={12} />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre
        className="
          p-3 md:p-4
          overflow-x-auto
          text-[11px]
          md:text-[13px]
          leading-relaxed
          font-mono
          text-slate-200
          custom-scrollbar
        "
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* -----------------------------
   Markdown Formatter
------------------------------ */

const formatMessage = (content) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];

  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /* Code block */
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line
          .replace("```", "")
          .trim();

        codeBlockContent = [];
      } else {
        inCodeBlock = false;

        elements.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeBlockContent.join("\n")}
            language={codeLanguage}
          />
        );

        codeBlockContent = [];
        codeLanguage = "";
      }

      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    /* Empty line */
    if (!line.trim()) {
      elements.push(
        <div key={`space-${i}`} className="h-2" />
      );

      continue;
    }

    /* H2 */
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="
            mt-5
            mb-2
            text-base
            md:text-lg
            font-bold
            text-slate-900
            tracking-tight
          "
        >
          {formatInline(line.replace("## ", ""))}
        </h2>
      );

      continue;
    }

    /* H3 */
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="
            mt-4
            mb-1.5
            text-sm
            md:text-base
            font-semibold
            text-slate-900
          "
        >
          {formatInline(line.replace("### ", ""))}
        </h3>
      );

      continue;
    }

    /* Divider */
    if (
      line.trim() === "---" ||
      line.trim() === "***"
    ) {
      elements.push(
        <hr
          key={`hr-${i}`}
          className="my-4 border-slate-200"
        />
      );

      continue;
    }

    /* Quote */
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="
            my-2
            border-l-[3px]
            border-indigo-400
            pl-3
            py-1
            text-slate-500
            bg-indigo-50/50
            rounded-r-lg
          "
        >
          {formatInline(line.replace("> ", ""))}
        </blockquote>
      );

      continue;
    }

    /* Bullet */
    if (line.match(/^[-*]\s/)) {
      const bulletContent = line.replace(
        /^[-*]\s/,
        ""
      );

      elements.push(
        <div
          key={`bullet-${i}`}
          className="
            flex
            items-start
            gap-2
            my-1
            text-slate-700
          "
        >
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />

          <span className="flex-1">
            {formatInline(bulletContent)}
          </span>
        </div>
      );

      continue;
    }

    /* Numbered list */
    const numberMatch = line.match(
      /^(\d+)\.\s(.*)/
    );

    if (numberMatch) {
      elements.push(
        <div
          key={`num-${i}`}
          className="
            flex
            items-start
            gap-2
            my-1
            text-slate-700
          "
        >
          <span
            className="
              flex-shrink-0
              flex
              items-center
              justify-center
              w-5
              h-5
              rounded-md
              bg-indigo-50
              text-indigo-600
              text-[10px]
              font-bold
            "
          >
            {numberMatch[1]}
          </span>

          <span className="flex-1 pt-0.5">
            {formatInline(numberMatch[2])}
          </span>
        </div>
      );

      continue;
    }

    /* Paragraph */
    elements.push(
      <p
        key={`p-${i}`}
        className="
          my-1.5
          text-slate-700
          leading-7
          text-[13px]
          md:text-sm
        "
      >
        {formatInline(line)}
      </p>
    );
  }

  return elements;
};

/* -----------------------------
   Chat Message
------------------------------ */

const ChatMessage = ({ message }) => {
  if (!message) return null;

  const isUser = message.role === "user";
  const isStreaming = message.isStreaming || false;
  const content = message.content || "";

  const timestamp =
    message.timestamp instanceof Date
      ? message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Just now";

  return (
    <div
      className={`
        flex
        items-end
        gap-2.5
        md:gap-3
        w-full
        ${
          isUser
            ? "flex-row-reverse"
            : "flex-row"
        }
      `}
    >
      {/* Avatar */}
      

      {/* Message column */}
      <div
        className={`
          flex
          flex-col
          gap-1
          max-w-[88%]
          md:max-w-[78%]
          ${
            isUser
              ? "items-end"
              : "items-start"
          }
        `}
      >
        {/* Bubble */}
        <div
          className={`
            relative
            break-words
            leading-relaxed
            text-sm
            overflow-hidden
            ${
              isUser
                ? `
                  px-3.5
                  md:px-4
                  py-2.5
                  md:py-3
                  rounded-2xl
                  rounded-br-md
                  bg-gradient-to-br
                  from-indigo-600
                  to-blue-600
                  text-white
                  shadow-[0_5px_18px_-6px_rgba(79,70,229,0.45)]
                `
                : `
                  px-3.5
                  md:px-4
                  py-2.5
                  md:py-3
                  rounded-2xl
                  rounded-bl-md
                  bg-white
                  border
                  border-slate-200/80
                  text-slate-800
                  shadow-[0_3px_14px_-6px_rgba(15,23,42,0.15)]
                `
            }
          `}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">
              {content ||
                (isStreaming ? "..." : "")}
            </div>
          ) : (
            <div className="markdown-content">
              {isStreaming && !content ? (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span
                    className="
                      w-1.5 h-1.5
                      rounded-full
                      bg-slate-400
                      animate-bounce
                    "
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="
                      w-1.5 h-1.5
                      rounded-full
                      bg-slate-400
                      animate-bounce
                    "
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              ) : (
                formatMessage(content)
              )}

              {isStreaming && content && (
                <span
                  className="
                    inline-block
                    w-1
                    h-4
                    ml-1
                    bg-indigo-500
                    animate-pulse
                    rounded-full
                    align-middle
                  "
                />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div
          className={`
            flex
            items-center
            gap-1.5
            px-1
            ${
              isUser
                ? "flex-row-reverse"
                : "flex-row"
            }
          `}
        >
          {isUser && !isStreaming && (
            <CheckCheck
              size={12}
              className="text-indigo-500"
            />
          )}

          <span
            className="
              text-[9px]
              md:text-[10px]
              font-medium
              text-slate-400
            "
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;