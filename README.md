# Code Review Agent

An AI agent that reviews code, remembers a team's coding standards and past feedback, and avoids repeating the same suggestions. It learns over time by storing flagged patterns and recalling them on future reviews.

## The Problem
Generic linters miss architectural context, and LLM code reviews can be annoying if they repeatedly suggest the same "fixes" that a team has already rejected or standardized against. This agent solves that by maintaining a memory of past feedback.

## Tech Stack
* **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
* **Backend**: Next.js API Routes calling Claude API
* **Memory**: [Hindsight](https://github.com/vectorize-io/hindsight) via `@vectorize-io/hindsight-client`
* **Persona Engine**: Inherits review philosophy from `vectorize-io/self-driving-agents`

## How Memory Works
On each code review:
1. The app calls `recall()` on Hindsight to fetch any relevant past feedback or patterns related to the submitted code snippet.
2. This recalled context is injected into the prompt for the Claude API.
3. If Claude identifies any *new* recurring patterns or high-level architectural feedback in its review, the app automatically calls `retain()` to save this insight into Hindsight for the future.

## Screenshots
*(Add screenshot of the UI here)*

## Setup & Run
Please see [GUIDE.md](./GUIDE.md) for full setup instructions to run Hindsight via Docker and start this application.