import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { sendMessage, endChat, getFlows } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [flows, setFlows] = useState([]);
  const [flowName, setFlowName] = useState("");
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [flowsError, setFlowsError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );
  const selectedFlow = flows.find(flow => flow.name === flowName);

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

  // Fetch flows on first load so list is ready without manual click
  useEffect(() => {
    handleFetchFlows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchFlows = async () => {
    setFlowsLoading(true);
    setFlowsError("");
    try {
      const fetchedFlows = await getFlows();
      setFlows(fetchedFlows || []);
      if (fetchedFlows?.length) {
        setFlowName((current) =>
          current && fetchedFlows.some((flow) => flow.name === current)
            ? current
            : fetchedFlows[0].name
        );
      } else {
        setFlowName("");
      }
    } catch (error) {
      console.error("Error fetching flows:", error);
      setFlowsError(error?.message || "Unable to fetch flows");
    } finally {
      setFlowsLoading(false);
    }
  };

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
        onFetchFlows={handleFetchFlows}
        flowsLoading={flowsLoading}
        flowsError={flowsError}
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
