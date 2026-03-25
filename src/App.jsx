import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { sendMessage, endChat } from './services/api';
import flows from './data/flows.json';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const defaultFlowName = flows[0]?.name || "DemoFlow";
  const [flowName, setFlowName] = useState(defaultFlowName);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );
  const selectedFlow = flows.find(flow => flow.name === flowName) || flows[0];

  // Close the sidebar on small screens when resizing down
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const errText = error?.message || "Sorry, something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', content: errText }]);
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
        flows={flows}
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
          examples={selectedFlow?.initialMessages || []}
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
