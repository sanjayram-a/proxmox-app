#!/bin/bash

# Remove existing node_modules and package-lock.json if they exist
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Install additional development dependencies
npm install --save-dev @types/node @types/react @types/react-dom @types/react-router-dom typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Create a production build
npm run build

echo "Frontend dependencies installed successfully!"
echo "You can now start the development server with: npm start"