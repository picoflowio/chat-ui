import React from 'react';
import './ExampleQueries.css';

const EXAMPLES = [
    "Hi",
    "I want to book a hotel.",
    "What is available in Portland",
];

export default function ExampleQueries({ onSelect }) {
    return (
        <div className="example-queries">
            <h3>Choose a common question:</h3>
            <div className="examples-grid">
                {EXAMPLES.map((query, index) => (
                    <button
                        key={index}
                        className="example-btn"
                        onClick={() => onSelect(query)}
                    >
                        {query}
                    </button>
                ))}
            </div>
        </div>
    );
}
