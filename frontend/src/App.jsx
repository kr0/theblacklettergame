import React from "react";
import PassphraseGate from "./components/PassphraseGate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RulesViewer from "./components/RulesViewer";
import RulesEditor from "./components/RulesEditor";
import { AuthProvider } from "./auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <PassphraseGate>
          <div>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/rules" element={<RulesViewer />} />
              <Route path="/rules/:ruleName/edit" element={<RulesEditor />} />
            </Routes>
          </div>
        </PassphraseGate>
      </Router>
    </AuthProvider>
  );
}

export default App;
