import React, { useState } from 'react';
import './InputArea.css';

export default function InputArea({ onSend, disabled }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <form className="input-area" onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your message..."
                disabled={disabled}
                className="chat-input"
                autoFocus
            />
            <button type="submit" disabled={disabled || !input.trim()} className="send-btn">
                Send
            </button>
        </form>
    );
}
