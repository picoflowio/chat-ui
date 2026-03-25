import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import "./Message.css";

// eslint-disable-next-line react/prop-types
export default function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={clsx("message-row", isUser ? "user-row" : "bot-row")}>
      <div className={clsx("avatar", isUser ? "user-avatar" : "bot-avatar")}>
        {isUser ? "👤" : <img src="/picoclaw.png" alt="Bot" className="bot-icon" />}
      </div>

      <div
        className={clsx(
          "message-bubble",
          isUser ? "user-bubble" : "bot-bubble",
        )}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
