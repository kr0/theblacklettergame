import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

/**
 * RulesViewer displays a list of rules and their content.
 * Includes a Back button to return to the Landing Page.
 */
const RulesViewer = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [ruleContent, setRuleContent] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/rules")
      .then((res) => res.json())
      .then((data) => setRules(data.rules));
  }, []);

  const handleRuleClick = (rule) => {
    setSelectedRule(rule);
    fetch(`http://localhost:8000/rules/${rule}`)
      .then((res) => res.text())
      .then((text) => setRuleContent(text));
  };

  return (
    <div>
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/")}>Back to Landing Page</button>
      <h2>Rules (Raw Markdown)</h2>
      <ul>
        {rules.map((rule) => (
          <li key={rule}>
            <button onClick={() => handleRuleClick(rule)}>{rule}</button>
          </li>
        ))}
      </ul>
      {selectedRule && (
        <div>
          <h3>{selectedRule}</h3>
          <div style={{ marginBottom: "0.5rem" }}>
            <button onClick={() => setShowRaw(false)} disabled={!showRaw} style={{ marginRight: "0.5rem" }}>
              Rendered Markdown
            </button>
            <button onClick={() => setShowRaw(true)} disabled={showRaw}>
              Raw Markdown
            </button>
          </div>
          {showRaw ? (
            <pre style={{ whiteSpace: "pre-wrap" }}>{ruleContent}</pre>
          ) : (
            <ReactMarkdown>{ruleContent}</ReactMarkdown>
          )}
        </div>
      )}
      <button style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>Back to Landing Page</button>
    </div>
  );
};

export default RulesViewer;
