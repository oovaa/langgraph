import { llm } from './llm' // ASSUMED: llm is correctly configured ChatModel instance
import { PromptTemplate } from '@langchain/core/prompts'
import { Document } from '@langchain/core/documents'
import { CohereEmbeddings } from '@langchain/cohere' // Ensure COHERE_API_KEY is set
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
// Optional: import { StringOutputParser } from "@langchain/core/output_parsers";

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
  const pageContents = docs.map((doc) => doc.pageContent).join('\n\n')
  const texts = await textSplitter.splitText(pageContents)

  const embeddings = new CohereEmbeddings({ model: 'embed-english-v3.0' }) // Verify model
  const documentsToEmbed = texts.map(
    (text) => new Document({ pageContent: text })
  )
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documentsToEmbed,
    embeddings
  )
  const retriever = vectorStore.asRetriever({ k: 2 })

  // --- Retrieval ---
  console.log('Retrieving...')
  const question = 'What is the main topic of the document?'
  const retrievedDocs = await retriever.invoke(question)
  const context = formatDocumentsAsString(retrievedDocs)

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
    prompt,
    llm,
    // Optional: new StringOutputParser(), // Add if llm output needs string conversion
  ])

  const response = await generationChain.invoke({
    context: context,
    question: question,
  })

  console.log('\nResponse:')
  console.log(response.content) // Adjust if using StringOutputParser
}

runRAG().catch(console.error)
