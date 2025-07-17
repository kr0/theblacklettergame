#!/bin/bash
# Script to build React frontend
cd frontend
rm -rf dist
# Only install if node_modules does not exist (speeds up CI/local builds)
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run build
