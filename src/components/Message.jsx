/* eslint-disable react/prop-types */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import "./Message.css";

const markdownComponents = {
  table(props) {
    return (
      <div className="markdown-table-wrap">
        <table {...props} />
      </div>
    );
  },
};

export default function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={clsx("message-row", isUser ? "user-row" : "bot-row")}>
      <div className={clsx("avatar", isUser ? "user-avatar" : "bot-avatar")}>
        {isUser ? "🙍" : "🦞"}
      </div>

      <div
        className={clsx(
          "message-bubble",
          isUser ? "user-bubble" : "bot-bubble",
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
