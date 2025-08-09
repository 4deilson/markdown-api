<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Markdown-to-HTML API

This is a Node.js Express API project for converting Markdown content to HTML.

## Project Context
- **Technology Stack**: Node.js, Express.js, markdown-it
- **Purpose**: Simple and direct API for Markdown to HTML conversion
- **Port**: 7000
- **Main Features**: 
  - Simple markdown conversion (`/convert`)
  - Full HTML document generation (`/convert/full`)
  - Health check endpoint (`/health`)
  - CORS enabled for web usage

## Code Style Guidelines
- Use simple, readable JavaScript (ES6+)
- Prefer explicit error handling with try-catch
- Include helpful console logging
- Use descriptive variable names
- Keep functions focused and small

## API Design Principles
- RESTful endpoints
- Clear JSON responses
- Proper HTTP status codes
- Comprehensive error messages
- Input validation

## When contributing to this project:
1. Maintain the simple and direct approach
2. Test all endpoints thoroughly
3. Ensure proper error handling
4. Update documentation when adding features
5. Keep dependencies minimal
