# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kid's Math Task Generator — a React app for generating printable math worksheets for children. Supports interactive mode (on-screen answering with numeric keyboard) and print mode (A4-formatted worksheets). Bilingual: English and Norwegian.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build via Vite
- `npm run preview` — Preview production build

No test framework is configured. `verify_generator.ts` is a standalone script for checking task generation logic.

## Architecture

Single-page React 19 app with TypeScript, bundled by Vite. Styling uses Tailwind CSS loaded via CDN (`<script src="https://cdn.tailwindcss.com">` in `index.html`), not installed as a dependency. Google Fonts (Nunito, Fredoka, Schoolbell) and Material Symbols are also loaded via CDN.

**Key files:**
- `App.tsx` — Root component, manages all state (settings persisted to localStorage)
- `types.ts` — `Task` interface, `DisplayMode` enum, `Language` type
- `constants.ts` — Translations (en/no), emoji/symbol pools, difficulty steps, display mode definitions
- `services/taskGenerator.ts` — Generates unique math problems with weighted randomness to reduce trivial (zero-operand) tasks

**Components:**
- `Controls.tsx` — Settings panel (language, difficulty, display mode, toggles)
- `PrintableSheet.tsx` — A4-sized print preview container
- `TaskRow.tsx` — Individual task rendering (symbols, numbers, or mixed)
- `Symbols.tsx` — Material Symbols icon rendering for black-and-white mode
- `NumericKeyboard.tsx` — On-screen keyboard for interactive mode

## Key Concepts

- **Display modes**: `SYMBOLS_ONLY` (emoji/icon representations), `MIXED` (symbols + numbers), `NUMBERS_ONLY` (pure arithmetic). Modes with symbols are restricted to maxSum ≤ 15.
- **Black & white mode**: Switches from emojis to Material Symbols icons for printer-friendly output.
- **Difficulty**: Controlled by `maxSum` (from `DIFFICULTY_STEPS`: 5, 10, 11–15, 20, 30, 50, 100, 200, 500, 1000). Tasks generate addition problems where the sum ≤ maxSum.
- **Path alias**: `@` maps to project root in `vite.config.ts`.
