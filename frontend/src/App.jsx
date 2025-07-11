import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RulesViewer from "./components/RulesViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rules" element={<RulesViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
