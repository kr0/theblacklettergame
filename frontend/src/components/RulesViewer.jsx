import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { BACKEND_URL } from "../constants";

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
  const [gamemasterMode, setGamemasterMode] = useState(false);
  const [gmPasswordInput, setGmPasswordInput] = useState("");
  const [gmPasswordError, setGmPasswordError] = useState("");
  // Remove editing state, editing is now handled by RulesEditor route
  const [newRuleName, setNewRuleName] = useState("");
  // Store the gamemaster session passphrase after successful entry
  const [gmSessionPassphrase, setGmSessionPassphrase] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [rulesLoading, setRulesLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");

  // Fetch rules
  // Fetch rules and sort by creation date (newest first)
  const fetchRules = () => {
    setRulesLoading(true);
    fetch(`${BACKEND_URL}/rules`)
      .then((res) => res.json())
      .then((data) => {
        // data.rules is now a list of {name, created_at}
        setRules(data.rules || []);
      })
      .finally(() => setRulesLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Create Rule
  const handleCreateRule = async () => {
    if (!newRuleName) {
      setMessage("Rule name required.");
      return;
    }
    if (!gmSessionPassphrase) {
      setMessage("Gamemaster session not active.");
      return;
    }
    setMessage("");
    const payload = { rule_name: newRuleName, passphrase: gmSessionPassphrase };
    console.log("Creating rule with payload:", payload);
    const res = await fetch(`${BACKEND_URL}/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setNewRuleName("");
      setNotification("Rule created!");
      setTimeout(() => setNotification(""), 2000);
      fetchRules();
    } else {
      let errText = await res.text();
      let msg = errText;
      try {
        const err = JSON.parse(errText);
        msg = err.detail || errText;
      } catch {}
      if (typeof msg === 'object') {
        msg = JSON.stringify(msg);
      } else if (Array.isArray(msg)) {
        msg = msg.join(', ');
      }
      setMessage(msg || "Error creating rule.");
    }
  };

  // Delete Rule
  const handleDeleteRule = async (rule) => {
    if (!gmSessionPassphrase) {
      setDeleteMessage("Gamemaster session not active.");
      return;
    }
    setDeleteMessage("");
    const res = await fetch(`${BACKEND_URL}/rules/${rule}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase: gmSessionPassphrase }),
    });
    if (res.ok) {
      setDeleteMessage("");
      setSelectedRule(null);
      setNotification("Rule deleted!");
      setTimeout(() => setNotification(""), 2000);
      fetchRules();
    } else {
      const err = await res.json();
      let msg = err.detail;
      if (typeof msg === 'object') {
        msg = JSON.stringify(msg);
      } else if (Array.isArray(msg)) {
        msg = msg.join(', ');
      }
      setDeleteMessage(msg || "Error deleting rule.");
    }
  };


  // Remove duplicate fetchRules effect

  const handleRuleClick = (rule) => {
    setSelectedRule(rule);
    setMessage("");
    fetch(`${BACKEND_URL}/rules/${rule}`)
      .then((res) => res.json())
      .then((data) => setRuleContent(data.markdown))
      .catch(() => setRuleContent("Error loading rule."));
  };




  // Remove all editing/cancel/save logic; handled by RulesEditor

  // Handler for toggling gamemaster mode with password
  const handleToggleGamemasterMode = () => {
    if (!gamemasterMode) {
      // Prompt for password
      setGmPasswordInput("");
      setGmPasswordError("");
      setShowGmPasswordPrompt(true);
    } else {
      setGamemasterMode(false);
      setGmSessionPassphrase(""); // Clear session passphrase on logout
    }
  };

  const [showGmPasswordPrompt, setShowGmPasswordPrompt] = useState(false);

  const handleGmPasswordSubmit = () => {
    if (!gmPasswordInput) {
      setGmPasswordError("Password required.");
      return;
    }
    // Store the passphrase in session and enable gamemaster mode
    setGmSessionPassphrase(gmPasswordInput);
    setGamemasterMode(true);
    setShowGmPasswordPrompt(false);
    setGmPasswordInput("");
    setGmPasswordError("");
  };

  // Handler for delete confirmation
  const handleDeleteRuleWithConfirm = (rule) => {
    if (window.confirm(`Are you sure you want to delete the rule "${rule}"? This cannot be undone.`)) {
      handleDeleteRule(rule);
    }
  };

  return (
    <div>
      {/* Notification Toast (always visible at top level) */}
      {notification && (
        <div style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#222",
          color: "#fff",
          padding: "1em 2em",
          borderRadius: 8,
          boxShadow: "0 2px 8px #888",
          zIndex: 2000,
          fontWeight: "bold",
          fontSize: "1.1em"
        }}>
          {notification}
        </div>
      )}
      <button style={{ marginBottom: "1rem" }} onClick={() => navigate("/")}>Back to Landing Page</button>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={handleToggleGamemasterMode}
          style={{ background: gamemasterMode ? '#222' : '#eee', color: gamemasterMode ? '#fff' : '#222', border: '1px solid #ccc', borderRadius: 6, padding: '0.5em 1.2em', fontWeight: 'bold' }}
        >
          {gamemasterMode ? 'Gamemaster Mode: ON' : 'Gamemaster Mode: OFF'}
        </button>
      </div>

      {/* Gamemaster password prompt modal */}
      {showGmPasswordPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2em', borderRadius: 8, boxShadow: '0 2px 8px #888', minWidth: 300 }}>
            <h3>Enter Gamemaster Password</h3>
            <input
              type="password"
              value={gmPasswordInput}
              onChange={e => setGmPasswordInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleGmPasswordSubmit(); }}
              style={{ width: '100%', marginBottom: '1em' }}
              autoFocus
            />
            {gmPasswordError && <div style={{ color: 'red', marginBottom: '1em' }}>{gmPasswordError}</div>}
            <div style={{ display: 'flex', gap: '1em', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowGmPasswordPrompt(false)}>Cancel</button>
              <button onClick={handleGmPasswordSubmit}>Enter</button>
            </div>
          </div>
        </div>
      )}

      <h2>Rules</h2>

      {/* Gamemaster-only: Create Rule UI */}
      {gamemasterMode && (
        <div style={{ marginBottom: "2rem", background: "#f9f9f9", padding: "1em", borderRadius: "8px" }}>
          <h3>Add New Rule</h3>
          <input
            type="text"
            placeholder="Rule name"
            value={newRuleName}
            onChange={e => setNewRuleName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreateRule(); }}
            style={{ marginRight: "1em" }}
          />
          <button onClick={handleCreateRule}>Create Rule</button>
          {message && message !== "Rule created!" && <div style={{ color: "red", marginTop: "0.5em" }}>{message}</div>}
        </div>
      )}

      <ul>
        {rules.map((ruleObj) => (
          <li key={ruleObj.name} style={{ display: "flex", alignItems: "center", gap: "0.5em", marginBottom: "0.4em" }}>
            {/* Gamemaster-only: Delete button for each rule (trashcan icon, left) */}
            {gamemasterMode && (
              <button
                style={{
                  color: "#fff",
                  background: "#c00",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.2em 0.5em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={() => handleDeleteRuleWithConfirm(ruleObj.name)}
                title="Delete rule"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5.5V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5V5.5" stroke="white" strokeWidth="1.2"/>
                  <rect x="1.5" y="3.5" width="13" height="2" rx="1" fill="#c00" stroke="white" strokeWidth="1.2"/>
                  <path d="M6 7V12" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M10 7V12" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            <button onClick={() => handleRuleClick(ruleObj.name)}>{ruleObj.name}</button>
            <span style={{ fontSize: "0.85em", color: "#888", marginLeft: 8 }}>
              Created: {typeof ruleObj.created_at === 'string'
                ? ruleObj.created_at.split(/[.+]/)[0].trim()
                : ruleObj.created_at && ruleObj.created_at._seconds
                  ? new Date(ruleObj.created_at._seconds * 1000).toLocaleString()
                  : ""}
              {ruleObj.updated_at && (
                <>
                  {" | Last updated: "}
                  {typeof ruleObj.updated_at === 'string'
                    ? ruleObj.updated_at.split(/[.+]/)[0].trim()
                    : ruleObj.updated_at._seconds
                      ? new Date(ruleObj.updated_at._seconds * 1000).toLocaleString()
                      : ""}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Gamemaster-only: Delete feedback */}
      {gamemasterMode && deleteMessage && (
        <div style={{ margin: "1em 0" }}>
          <span style={{ color: "red" }}>{deleteMessage}</span>
        </div>
      )}

      {selectedRule && (
        <div>
          <h3>{selectedRule}</h3>
          <div style={{ marginBottom: "0.5rem" }}>
            {/* Gamemaster-only: Edit button */}
          {gamemasterMode && (
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => navigate(`/rules/${selectedRule}/edit`)}
            >
              Edit
            </button>
          )}
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1.5em' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ marginBottom: '0.5em' }}>Rendered Markdown</h4>
              <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: '1em', background: '#fafafa', minHeight: 200 }}>
                <ReactMarkdown>{ruleContent}</ReactMarkdown>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ marginBottom: '0.5em' }}>Raw Markdown</h4>
              <pre style={{ border: '1px solid #ddd', borderRadius: 6, padding: '1em', background: '#f4f4f4', minHeight: 200, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{ruleContent}</pre>
            </div>
          </div>
        </div>
      )}
      <button style={{ marginTop: "1rem" }} onClick={() => navigate("/")}>Back to Landing Page</button>
    </div>
  );
}

export default RulesViewer;
