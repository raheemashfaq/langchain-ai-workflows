
# Document Loaders and Text Splitters

## Objective
Load documents and divide them into smaller chunks before embedding.

## Important components

- TextLoader: Reads text files and creates LangChain Documents.
- RecursiveCharacterTextSplitter: Splits documents into smaller chunks.
- chunkSize: Controls the approximate maximum chunk size.
- chunkOverlap: Controls repeated content between neighboring chunks.
- Metadata: Stores additional information such as the source file.

## Pipeline

Text File -> Document Loader -> Document -> Text Splitter -> Chunks

## Why chunk documents?

1. Improves retrieval precision.
2. Retrieves smaller, relevant sections.
3. Reduces unnecessary context sent to the LLM.
4. Helps preserve context through chunk overlap.

## Key takeaway

Each chunk can be embedded separately and retrieved independently.

## Common mistake

Increasing chunk size generally reduces the number of chunks, while decreasing it generally increases the number of chunks.

## Practice

Change chunkSize and chunkOverlap and observe how the generated chunks change.
