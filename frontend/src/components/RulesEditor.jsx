
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants";

export default function RulesEditor() {
  const { ruleName } = useParams();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState("");
  const [editValue, setEditValue] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/rules/${ruleName}`)
      .then(res => res.json())
      .then(data => {
        setMarkdown(data.markdown);
        setEditValue(data.markdown);
      })
      .catch(() => setMarkdown("Error loading rule."));
  }, [ruleName]);

  const handleSave = async () => {
    setMessage("");
    const res = await fetch(`${BACKEND_URL}/rules/${ruleName}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: editValue, passphrase }),
    });
    if (res.ok) {
      setMarkdown(editValue);
      setMessage("Saved!");
      setTimeout(() => navigate("/rules"), 1000);
    } else {
      const err = await res.json();
      setMessage(err.detail || "Error saving.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? You will lose your changes.")) {
      navigate("/rules");
    }
  };

  return (
    <div>
      <h2 className="canterbury">Edit Rule: {ruleName}</h2>
      <textarea
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        rows={20}
        style={{ width: "100%" }}
      />
      <input
        type="password"
        placeholder="Enter gamemaster passphrase"
        value={passphrase}
        onChange={e => setPassphrase(e.target.value)}
        style={{ marginTop: "1em" }}
      />
      <div style={{ marginTop: "1em" }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
      {message && <div style={{ color: message === "Saved!" ? "green" : "red", marginTop: "1em" }}>{message}</div>}
    </div>
  );
}