# Setup Guide

Follow these steps to get the Code Review Agent MVP running locally.

## 1. Prerequisites
- Docker (must be running)
- Node.js (v18+)
- An Anthropic API Key (`sk-ant-...`)

## 2. Start Hindsight (Memory Service)
This runs the local vector memory layer that powers the agent's ability to recall past feedback.

```bash
export ANTHROPIC_API_KEY=your_api_key_here
docker run -it --pull always --name hindsight --restart unless-stopped -p 8888:8888 -p 9999:9999 \
  -e HINDSIGHT_API_LLM_PROVIDER=anthropic \
  -e HINDSIGHT_API_LLM_API_KEY=$ANTHROPIC_API_KEY \
  -v $HOME/.hindsight-docker:/home/hindsight/.pg0 \
  ghcr.io/vectorize-io/hindsight:latest
```
*Note: The API will be available at `http://localhost:8888` and the UI at `http://localhost:9999`.*

## 3. Install App Dependencies
```bash
npm install
```

## 4. Environment Variables
Create a `.env.local` file in the root of the project:
```
ANTHROPIC_API_KEY=your_api_key_here
HINDSIGHT_BASE_URL=http://localhost:8888
```

## 5. Run the Application
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Managing Memory
- **Reset Memory**: To completely clear the agent's memory, stop the Docker container and delete the volume: `rm -rf $HOME/.hindsight-docker`, then restart the container.
- **View Memory**: Visit `http://localhost:9999` while the container is running to see raw vector data and banks.

## Limitations & Stretch Goals
- **Single File Only**: Currently only accepts pasted snippets or single files, no full repo cloning.
- **Stretch Feature**: Future implementation could include parsing GitHub PR URLs to pull diffs automatically.