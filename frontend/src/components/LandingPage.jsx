
import React from "react";
import { Link } from "react-router-dom";
import { DISCORD_URL, TWITTER_URL } from "../constants";

function LandingPage() {
  return (
    <div style={{ fontFamily: 'serif', padding: '2rem', background: '#f8f9fa' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0.5em 0', color: '#222', fontFamily: 'Blackletter, serif', letterSpacing: '2px' }}>
          Blackletter
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#333', fontWeight: 'bold', margin: '0.5em 0' }}>
          Fast. Tactical. Miniature-agnostic.
        </p>
        <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '500px', margin: '0 auto' }}>
          A wargame for any minis, any table, any time.
        </p>
      </section>

      {/* About the Game Section */}
      <section style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #eee', padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ color: '#222', marginBottom: '1rem' }}>About the Game</h2>
        <p style={{ color: '#444', lineHeight: '1.7' }}>
          Blackletter is a framework for entertaining, tactically rich battles. The rules are streamlined for quick learning and fast play, but offer enough depth for creative strategies and memorable moments. Whether you’re a veteran wargamer or new to the hobby, Blackletter is designed to be accessible, flexible, and fun.
        </p>
      </section>

      {/* Call to Action Section */}
      <section style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2 style={{ color: '#222', marginBottom: '1rem' }}>Get Started</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <Link to="/rules" style={{
            background: '#222', color: '#fff', padding: '0.8em 2em', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 1px 4px #ddd', transition: 'background 0.2s',
          }}>Read the Rules</Link>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{
            background: '#0077ff', color: '#fff', padding: '0.8em 2em', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 1px 4px #ddd', transition: 'background 0.2s',
          }}>Join Our Community</a>
          <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" style={{
            background: '#1da1f2', color: '#fff', padding: '0.8em 2em', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', boxShadow: '0 1px 4px #ddd', transition: 'background 0.2s',
          }}>Follow Our Progress</a>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
