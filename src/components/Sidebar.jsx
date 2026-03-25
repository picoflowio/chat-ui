/* eslint-disable react/prop-types */
import "./Sidebar.css";
import iconPng from "/icon.png";
import trashPng from "/trash.png";
import urlPng from "/url.png";
import flowPng from "/flow.png";

export default function Sidebar({
  onNewChat,
  onFetchFlows,
  flowName,
  setFlowName,
  isOpen,
  flowsLoading = false,
  flows = [],
  onSetBaseUrl,
}) {
  const flowOptions = flows.length ? flows.map((flow) => flow.name) : [];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src={iconPng} alt="PicoChat icon" className="title-icon" />
        <h2>PicoChat</h2>
      </div>

      <div className="sidebar-content">
        <div className="section">
          <button className="new-chat-btn" onClick={onNewChat}>
            <img src={trashPng} alt="New chat" className="new-chat-icon" />
            New Chat
          </button>
        </div>

        <div className="divider"></div>

        <div className="section">
          <button
            className="new-chat-btn fetch-flows-btn"
            onClick={onFetchFlows}
            disabled={flowsLoading}
          >
            {flowsLoading ? (
              "⏳ Loading..."
            ) : (
              <>
                <img src={flowPng} alt="Get Flows" />
                <span>Get Flows</span>
              </>
            )}
          </button>
        </div>

        <div className="section">
          <label>Select Flow:</label>
          <select
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="flow-select"
            disabled={!flowOptions.length || flowsLoading}
          >
            {flowOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="divider"></div>

        <div className="section">
          <button className="new-chat-btn" onClick={onSetBaseUrl}>
            <img src={urlPng} alt="Set Base URL" />
            <span>Set Base URL</span>
          </button>
        </div>

        <div className="sidebar-footer">Copyright © picoflow.io 2026</div>
      </div>
    </aside>
  );
}
