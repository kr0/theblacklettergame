import React from "react";
import { useAuth } from "../auth/AuthProvider";

const GamemasterButton = () => {
  const { gamemasterMode, user, signInGamemaster, signOutGamemaster, authLoading } = useAuth();

  if (authLoading) return null;

  return (
    <button
      onClick={gamemasterMode ? signOutGamemaster : signInGamemaster}
      style={{
        background: gamemasterMode ? '#222' : '#eee',
        color: gamemasterMode ? '#fff' : '#222',
        border: '1px solid #ccc',
        borderRadius: 6,
        padding: '0.5em 1.2em',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}
    >
      {gamemasterMode ? `Gamemaster Mode: ON${user ? ` (${user.displayName || user.email})` : ''}` : 'Gamemaster Mode: OFF'}
    </button>
  );
};

export default GamemasterButton;
