import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import Dialog from './components/Dialog';
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
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const busyCountRef = useRef(0);
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
    const setBusy = (active) => {
      if (typeof document === "undefined") return;
      if (active) {
        busyCountRef.current += 1;
        document.body.style.cursor = "wait";
      } else {
        busyCountRef.current = Math.max(0, busyCountRef.current - 1);
        if (busyCountRef.current === 0) {
          document.body.style.cursor = "";
        }
      }
    };
    setBusy(true);

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
      setBusy(false);
    }
  };

  // Reset cursor if component unmounts while busy
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.cursor = "";
      }
    };
  }, []);

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
        flowName={flowName}
        setFlowName={setFlowName}
        isOpen={isSidebarOpen}
        onSetBaseUrl={() => {
          const stored = localStorage.getItem("picochat_base_url")?.trim() || "";
          const envBase = import.meta.env.VITE_API_BASE_URL?.trim() || "";
          const fileDefault =
            typeof window !== "undefined" && window.location.protocol === "file:"
              ? "http://localhost:8000"
              : "";
          // Show a sensible default instead of an empty field on first open
          const fallback = "http://localhost:8000";
          setTempUrl(stored || envBase || fileDefault || fallback);
          setIsUrlDialogOpen(true);
        }}
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

      <Dialog
        open={Boolean(flowsError)}
        title="Flow fetch failed"
        message={flowsError}
        onClose={() => setFlowsError("")}
      />

      <Dialog
        open={isUrlDialogOpen}
        title="Set Base URL"
        onClose={() => setIsUrlDialogOpen(false)}
        className="base-url-dialog"
        actions={
          <>
            <button className="dialog-action is-ghost" onClick={() => setIsUrlDialogOpen(false)}>
              Cancel
            </button>
            <button className="dialog-action" onClick={() => {
              localStorage.setItem("picochat_base_url", tempUrl);
              setIsUrlDialogOpen(false);
            }}>
              Save
            </button>
          </>
        }
      >
        <input
          id="base-url-field"
          className="base-url-field"
          type="text"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          aria-label="Base URL"
        />
      </Dialog>
    </div>
  );
}

export default App;
