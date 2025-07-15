// src/constants.js


export const DISCORD_URL = "https://discord.gg/blackletter";
export const TWITTER_URL = "https://twitter.com/blacklettergame";
// Use localhost for development, Cloud Run for production
export const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://blackletter-backend-ktuc7iha4a-uc.a.run.app";
