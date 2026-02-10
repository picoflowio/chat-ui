import React from 'react';
import './Sidebar.css';

const FLOW_OPTIONS = ["DemoFlow", "TutorialFlow", "HotelFlow", "InvoiceFlow", "ApptFlow", "TravelFlow"];

export default function Sidebar({ onNewChat, flowName, setFlowName, isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2>PicoFlow.io Chat</h2>
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
                        {FLOW_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
        </aside>
    );
}
