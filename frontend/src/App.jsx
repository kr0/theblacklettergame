import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RulesViewer from "./components/RulesViewer";
import RulesEditor from "./components/RulesEditor";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rules" element={<RulesViewer />} />
          <Route path="/rules/:ruleName/edit" element={<RulesEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
