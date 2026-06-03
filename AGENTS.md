# Agent Instructions

## Project Overview

This is a React 19 + TypeScript + Vite cinema project about movies. The app uses React Router, Redux Toolkit, Firebase, TMDB API helpers, SCSS, Tailwind CSS, and Prettier.

## Common Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production bundle: `npm run build`

There is currently no test script configured in `package.json`.

## Project Structure

- `src/pages/`: route-level pages such as home, search, sign in, sign up, movie details, and person details.
- `src/components/`: reusable UI components and layout components.
- `src/routes/`: app routing and protected route logic.
- `src/store/`: Redux store setup and slices.
- `src/api/`: TMDB API configuration, client helpers, and API types.
- `src/styles/`: global styles, variables, page styles, and component styles.
- `src/hooks/`: reusable React hooks.

## Coding Guidelines

- Follow the existing TypeScript and React patterns before adding new abstractions.
- Prefer functional React components and hooks.
- Keep changes scoped to the user's request.
- Do not rewrite unrelated files or reformat files unnecessarily.
- Use existing style locations and naming conventions for SCSS and components.
- Keep API keys, Firebase credentials, and environment-specific values out of committed source files.

## Verification

After code changes, run `npm run build` when practical to catch TypeScript and Vite build errors.
