/* eslint-disable react/prop-types */
import "./Sidebar.css";

export default function Sidebar({
  onNewChat,
  flowName,
  setFlowName,
  isOpen,
  flows = [],
}) {
  const flowOptions = flows.length
    ? flows.map((flow) => flow.name)
    : ["DemoFlow"];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>picoflow.io Chat</h2>
      </div>

      <div className="sidebar-content">
        <div className="section">
          <button className="new-chat-btn" onClick={onNewChat}>
            🗑️ New Chat
          </button>
        </div>

        <div className="divider"></div>

        <div className="section">
          <label>Select Flow:</label>
          <select
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="flow-select"
          >
            {flowOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
