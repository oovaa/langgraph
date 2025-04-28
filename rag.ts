import { StringOutputParser } from '@langchain/core/output_parsers'
import { llm } from './llm' // ASSUMED: llm is correctly configured ChatModel instance
import { PromptTemplate } from '@langchain/core/prompts'
import { CohereEmbeddings } from '@langchain/cohere' // Ensure COHERE_API_KEY is set
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables'

// Optional: import { StringOutputParser } from "@langchain/core/output_parsers";

let gRetriver: ReturnType<
  typeof MemoryVectorStore.prototype.asRetriever
> | null = null
let gVDB: MemoryVectorStore | null = null

const addDocumentsToVDB = async (file_path: string): Promise<void> => {
  if (!gVDB) {
    throw new Error('Global vector database (gVDB) is not initialized.')
  }

  const loader = new DocxLoader(file_path)
  const docs = await loader.load()

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 0,
  })

  const texts = await textSplitter.splitDocuments(docs)

  await gVDB.addDocuments(texts)
  console.log(
    `Documents from ${file_path} have been added to the vector database.`
  )
}

const initializeDocumentRetriever = async (
  file_path: string
): Promise<
  [
    ReturnType<typeof MemoryVectorStore.prototype.asRetriever>,
    MemoryVectorStore
  ]
> => {
  const loader = new DocxLoader(file_path)
  const docs = await loader.load()

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 0,
  })

  const texts = await textSplitter.splitDocuments(docs)

  const embeddings = new CohereEmbeddings({ model: 'embed-english-v3.0' })

  const vectorStore = await MemoryVectorStore.fromDocuments(texts, embeddings)
  const retriever = vectorStore.asRetriever({ k: 2 })

  return [retriever, vectorStore]
}

async function runRAG() {
  // --- Setup ---
  console.log('Setting up...')
  const fileName = 'Darajat.docx' // Make sure this file exists
  const loader = new DocxLoader(fileName)
  const docs = await loader.load()

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 0,
  })

  const texts = await textSplitter.splitDocuments(docs) // the right way

  // console.log(texts)

  const embeddings = new CohereEmbeddings({ model: 'embed-english-v3.0' }) // Verify model

  const vectorStore = await MemoryVectorStore.fromDocuments(texts, embeddings)
  const retriever = vectorStore.asRetriever({ k: 2 })

  const retrieve_chain = RunnableSequence.from([
    {
      context: (input) => retriever.invoke(input.question),
    },
    // (prevResult) => console.log(prevResult),

    new RunnablePassthrough(), // Add a passthrough runnable as the second element
  ])

  // --- Retrieval ---
  console.log('Retrieving...')
  const question = 'What is the main topic of the document?'

  // --- Generation ---
  console.log('Generating...')
  const template = `Answer the question based only on the following context:
Context:
{context}

Question:
{question}

Answer:`
  const prompt = PromptTemplate.fromTemplate(template)

  const generationChain = RunnableSequence.from([
    { context: retrieve_chain, question: (prev) => prev.question },
    prompt,
    // (prevResult) => console.log(prevResult),
    llm,
    new StringOutputParser(),
  ])

  const response = await generationChain.invoke({ question })

  console.log('\nResponse:')
  console.log(response) // Adjust if using StringOutputParser
}

// runRAG().catch(console.error)

if (!Boolean(gRetriver) || !Boolean(gVDB)) {
  ;[gRetriver, gVDB] = await initializeDocumentRetriever('Darajat.docx')
}
const question = 'What is the main topic of the document?'

// --- Generation ---
console.log('Generating...')
const template = `Answer the question based only on the following context:
Context:
{context}

Question:
{question}

Answer:`
const prompt = PromptTemplate.fromTemplate(template)

const generationChain = RunnableSequence.from([
  {
    context: ({ question }) => gRetriver?.invoke(question),
    question: new RunnablePassthrough(),
  },
  // (prevResult) => console.log(prevResult),
  prompt,
  llm,
  new StringOutputParser(),
])

const response = await generationChain.invoke({ question })

console.log('\nResponse:')
console.log(response) // Adjust if using StringOutputParser
