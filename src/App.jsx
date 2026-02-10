import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { sendMessage, endChat } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [flowName, setFlowName] = useState("DemoFlow");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputDisabled(true);

    try {
      const response = await sendMessage(text, flowName, sessionId);

      // Update session ID if changed
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      // Add bot message
      const botMsg = { role: 'bot', content: response.message };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Add error message
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setInputDisabled(false);
    }
  };

  const handleNewChat = async () => {
    // End current session
    await endChat(sessionId);

    // Reset state
    setMessages([]);
    setSessionId("");
    // flowName stays the same
  };

  return (
    <div className="app-container">
      <Sidebar
        onNewChat={handleNewChat}
        flowName={flowName}
        setFlowName={setFlowName}
        isOpen={isSidebarOpen}
      />

      <main className="main-content">
        <button
          className="mobile-menu-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        <ChatArea
          messages={messages}
          isLoading={inputDisabled}
          onSelectExample={handleSendMessage}
        />

        <div className="input-container-wrapper">
          <InputArea onSend={handleSendMessage} disabled={inputDisabled} />
        </div>
      </main>
    </div>
  );
}

export default App;
