# LangChain.js AI Workflows

Runnable JavaScript workflows for building AI assistant capabilities with LangChain.js and Google Gemini. The repository covers prompt composition, routing, document ingestion, retrieval-augmented generation (RAG), and conversational history.

The RAG workflows currently use an in-memory vector store and sample pet-care content. A deployed service should use an appropriate persistent vector store and production data sources.

## Included workflows

- Basic, sequential, and parallel chains
- Routing between assistant workflows
- Retrieval with a vector store
- Loading and splitting local documents
- File-based RAG
- Conversation history

## Requirements

- Node.js 18 or newer
- A Google AI Studio API key for examples that call Gemini or create embeddings

## Setup

```bash
npm install
```

Create a `.env` file in the project root and add your API key:

```text
GOOGLE_API_KEY=your_api_key_here
```

Keep `.env` out of version control. Never commit API keys.

## Run an example

Run examples from the project root so relative data paths resolve correctly:

```bash
node src/01-basic-chain.js
node src/02-sequential-chain.js
node src/03-parallel-chain.js
node src/04-router-chain.js
node src/05-retrieval-chain.js
node src/07-document-ingestion.js
node src/08-file-based-rag.js
node src/09-conversation-history.js
```

`07-document-ingestion.js` loads and splits a local file; the model-based workflows require a valid API key and internet access. See `notes/` for implementation details.

## Project layout

```text
data/     Sample source documents
notes/    Implementation notes
src/      Numbered, runnable workflows
```

## Contributing and Git workflow

Keep `main` as the stable branch. Create a short-lived branch for each focused change:

```bash
git switch -c feature/add-streaming-workflow
# make and verify the change
git add .
git commit -m "feat: add streaming workflow"
git push -u origin feature/add-streaming-example
```

Open a pull request into `main` when the change is ready. Suggested branch prefixes:

- `feature/` for new examples or capabilities
- `fix/` for corrections
- `docs/` for documentation-only updates

Use concise [Conventional Commit](https://www.conventionalcommits.org/) messages, for example:

- `docs: add project setup guide`
- `feat: add file-based RAG workflow`
- `fix: correct document loader path`

Make commits small and focused so each one clearly explains a single change.
