import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ExampleQueries from './ExampleQueries';
import './ChatArea.css';

export default function ChatArea({ messages, isLoading, onSelectExample, examples = [] }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="chat-area">
            {messages.length === 0 ? (
                <ExampleQueries onSelect={onSelectExample} examples={examples} />
            ) : (
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <Message key={index} role={msg.role} content={msg.content} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
            {isLoading && (
                <div className="loading-indicator-container">
                    <div className="loading-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
