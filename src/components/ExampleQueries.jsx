import "./ExampleQueries.css";

// eslint-disable-next-line react/prop-types
export default function ExampleQueries({ onSelect, examples = [] }) {
  const queries = examples.length ? examples : ["Hi"];

  return (
    <div className="example-queries">
      <h3>Choose a common question:</h3>
      <div className="examples-grid">
        {queries.map((query, index) => (
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
