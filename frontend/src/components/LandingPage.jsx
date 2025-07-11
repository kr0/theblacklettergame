
import React from "react";
import { Link } from "react-router-dom";
import { DISCORD_URL, TWITTER_URL } from "../constants";

function LandingPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#f8f9fa' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', margin: '0.5em 0', color: '#222' }}>Welcome to Blackletter</h1>
        <p style={{ fontSize: '1.5rem', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
          A fast-paced, strategic word game inspired by medieval rules and modern fun.
        </p>
      </section>

      {/* About the Game Section */}
      <section style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #eee', padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ color: '#222', marginBottom: '1rem' }}>About the Game</h2>
        <p style={{ color: '#444', lineHeight: '1.7' }}>
          Blackletter is a unique blend of classic word games and medieval intrigue. Challenge your friends or play solo, mastering the rules and strategies to outwit your opponents. Each round brings new twists, with special rules inspired by historical manuscripts. Are you ready to become a Blackletter champion?
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
