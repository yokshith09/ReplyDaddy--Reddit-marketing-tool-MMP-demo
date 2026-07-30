# ReplyDaddy - MMP (Reddit Marketing Copilot)

This is a Minimum Marketable Product (MMP) built for the AI Generalist Assignment.

## Overview
ReplyDaddy is an AI-powered Reddit marketing tool that helps businesses find relevant posts to engage with and drafts authentic-sounding replies. It is aimed at marketers who want Reddit-driven leads without automated spam-posting.

## Features
- **Intelligent Scanning**: Uses `llama-3.1-8b-instant` via the Groq API to score the relevance of posts against a target keyword.
- **Authentic Drafting**: Generates context-aware, non-promotional draft replies tailored to the specific Reddit thread.
- **Premium UI**: Designed with a sleek, monochromatic visual identity, glassmorphism, and micro-animations to mimic a top-tier design studio product.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Groq LLM API (`llama-3.1-8b-instant`)

## Running Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set your Groq API key in a `.env.local` file:
   ```env
   GROQ_API_KEY=gsk_your_api_key_here
   ```
4. Start the development server: `npm run dev`

*Note: This demo uses a manufactured JSON dataset (`src/data/posts.json`) to simulate live Reddit scraping without requiring commercial API access.*
