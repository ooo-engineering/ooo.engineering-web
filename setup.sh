#!/bin/bash

echo "Setting up ooo.engineering-web..."

# Fix npm permissions
echo "Fixing npm permissions..."
sudo chown -R $(whoami) ~/.npm

# Clean and install
echo "Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Setup complete! Run 'npm run dev' to start the development server."