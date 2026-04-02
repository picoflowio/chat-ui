/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import "./InputArea.css";

export default function InputArea({ onSend, disabled }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // Return focus to the input whenever it becomes enabled again (e.g., after a server reply)
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your message..."
        disabled={disabled}
        className="chat-input"
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="send-btn"
      >
        Send
      </button>
    </form>
  );
}
