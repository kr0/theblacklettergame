
import React, { useEffect, useState } from "react";

const RulesViewer = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [ruleContent, setRuleContent] = useState("");

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
          <pre style={{ whiteSpace: "pre-wrap" }}>{ruleContent}</pre>
        </div>
      )}
    </div>
  );
};

export default RulesViewer;
