import { CohereEmbeddings } from '@langchain/cohere'
import { Document } from '@langchain/core/documents'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

// --- Setup (same docs, embeddings as before) ---
const docs = [
  new Document({
    pageContent: 'LangChain helps build LLM applications.',
    metadata: { source: 'intro', year: 2023 },
  }),
  new Document({
    pageContent: 'Retrievers fetch relevant documents.',
    metadata: { source: 'retrieval', year: 2024 },
  }),
  new Document({
    pageContent: 'Vector stores index document embeddings.',
    metadata: { source: 'vectorstore', year: 2022 },
  }),
  new Document({
    pageContent: 'Advanced retrieval uses MMR.',
    metadata: { source: 'retrieval', year: 2023 },
  }),
]
const embeddings = new CohereEmbeddings({
  model: 'embed-v4.0',
})
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)

// --- Create a configured retriever ---

// Retrieve only the top 2 documents
const retrieverTopK = vectorStore.asRetriever({
  k: 2,
})

// Retrieve top 5, but filter for documents from 2024
const retrieverFiltered = vectorStore.asRetriever({
  k: 5, // Retrieve up to 5
  filter: (doc) => doc.metadata.year === 2024,
})

// Retrieve using MMR
const retrieverMMR = vectorStore.asRetriever({
  searchType: 'mmr',
  k: 2, // Final number of docs to return
  searchKwargs: {
    fetchK: 5, // Fetch 5 docs initially for MMR calculation
    lambda: 0.5, // Balance between similarity and diversity (0=max diversity, 1=max similarity)
  },
})

// --- Use the configured retrievers ---
const query = 'Tell me about retrieval'

const relevantDocsTopK = await retrieverTopK.invoke(query)
console.log('\n--- Top K (k=2) ---')
console.log(relevantDocsTopK)

const relevantDocsFiltered = await retrieverFiltered.invoke(query)
console.log('\n--- Filtered (year=2024) ---')
console.log(relevantDocsFiltered)

const relevantDocsMMR = await retrieverMMR.invoke(query)
console.log('\n--- MMR (k=2, fetchK=5) ---')
console.log(relevantDocsMMR)

/* Expected Output Snippets:
--- Top K (k=2) ---
[ Document { pageContent: 'Retrievers fetch relevant documents.', metadata: { source: 'retrieval', year: 2024 } },
  Document { pageContent: 'Advanced retrieval uses MMR.', metadata: { source: 'retrieval', year: 2024 } } ]

--- Filtered (year=2024) ---
[ Document { pageContent: 'Retrievers fetch relevant documents.', metadata: { source: 'retrieval', year: 2024 } },
  Document { pageContent: 'Advanced retrieval uses MMR.', metadata: { source: 'retrieval', year: 2024 } },
  Document { pageContent: 'Vector stores index document embeddings.', metadata: { source: 'vectorstore', year: 2024 } } ]

--- MMR (k=2, fetchK=5) ---
// Output will likely contain 2 diverse documents related to retrieval
*/

// import { CohereEmbeddings } from '@langchain/cohere'
// import { FunctionalTranslator } from '@langchain/core/structured_query'
// import { MemoryVectorStore } from 'langchain/vectorstores/memory'
// import { SelfQueryRetriever } from 'langchain/retrievers/self_query'
// import type { AttributeInfo } from 'langchain/chains/query_constructor'
// import 'peggy'
// import { Document } from '@langchain/core/documents'
// import { llm } from './llm'

// /**
//  * First, we create a bunch of documents. You can load your own documents here instead.
//  * Each document has a pageContent and a metadata field. Make sure your metadata matches the AttributeInfo below.
//  */
// const docs = [
//   new Document({
//     pageContent:
//       'A bunch of scientists bring back dinosaurs and mayhem breaks loose',
//     metadata: {
//       year: 1993,
//       rating: 7.7,
//       genre: 'science fiction',
//       length: 122,
//     },
//   }),
//   new Document({
//     pageContent:
//       'Leo DiCaprio gets lost in a dream within a dream within a dream within a ...',
//     metadata: {
//       year: 2010,
//       director: 'Christopher Nolan',
//       rating: 8.2,
//       length: 148,
//     },
//   }),
//   new Document({
//     pageContent:
//       'A psychologist / detective gets lost in a series of dreams within dreams within dreams and Inception reused the idea',
//     metadata: { year: 2006, director: 'Satoshi Kon', rating: 8.6 },
//   }),
//   new Document({
//     pageContent:
//       'A bunch of normal-sized women are supremely wholesome and some men pine after them',
//     metadata: {
//       year: 2019,
//       director: 'Greta Gerwig',
//       rating: 8.3,
//       length: 135,
//     },
//   }),
//   new Document({
//     pageContent: 'Toys come alive and have a blast doing so',
//     metadata: { year: 1995, genre: 'animated', length: 77 },
//   }),
//   new Document({
//     pageContent: 'Three men walk into the Zone, three men walk out of the Zone',
//     metadata: {
//       year: 1979,
//       director: 'Andrei Tarkovsky',
//       genre: 'science fiction',
//       rating: 9.9,
//     },
//   }),
// ]

// /**
//  * We define the attributes we want to be able to query on.
//  * in this case, we want to be able to query on the genre, year, director, rating, and length of the movie.
//  * We also provide a description of each attribute and the type of the attribute.
//  * This is used to generate the query prompts.
//  */
// const attributeInfo: AttributeInfo[] = [
//   {
//     name: 'genre',
//     description: 'The genre of the movie',
//     type: 'string or array of strings',
//   },
//   {
//     name: 'year',
//     description: 'The year the movie was released',
//     type: 'number',
//   },
//   {
//     name: 'director',
//     description: 'The director of the movie',
//     type: 'string',
//   },
//   {
//     name: 'rating',
//     description: 'The rating of the movie (1-10)',
//     type: 'number',
//   },
//   {
//     name: 'length',
//     description: 'The length of the movie in minutes',
//     type: 'number',
//   },
// ]

// /**
//  * Next, we instantiate a vector store. This is where we store the embeddings of the documents.
//  * We also need to provide an embeddings object. This is used to embed the documents.
//  */
// const embeddings = new CohereEmbeddings({ model: 'embed-v4.0' })

// const documentContents = 'Brief summary of a movie'
// const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)

// const selfQueryRetriever = SelfQueryRetriever.fromLLM({
//   llm,
//   vectorStore,
//   documentContents,
//   attributeInfo,
//   /**
//    * We need to use a translator that translates the queries into a
//    * filter format that the vector store can understand. We provide a basic translator
//    * translator here, but you can create your own translator by extending BaseTranslator
//    * abstract class. Note that the vector store needs to support filtering on the metadata
//    * attributes you want to query on.
//    */
//   structuredQueryTranslator: new FunctionalTranslator(),
// })

// const re = await selfQueryRetriever.invoke(
//   'Which movies are rated haigher than 8.0 ?'
// )

// console.log(re)

// import { llm } from './llm'
// import { z } from 'zod'
// import { SystemMessage, HumanMessage } from '@langchain/core/messages'

// // Define a zod object for the structured output
// const Questions = z.object({
//   questions: z
//     .array(z.string())
//     .describe('A list of sub-questions related to the input query.'),
// })

// // Create an instance of the model and enforce the output structure
// const model = llm
// const structuredModel = model.withStructuredOutput(Questions)

// // Define the system prompt
// const system = `You are a helpful assistant that generates multiple sub-questions related to an input question.
// The goal is to break down the input into a set of sub-problems / sub-questions that can be answers in isolation.`

// // Pass the question to the model
// const question =
//   'What are the main components of an LLM-powered autonomous agent system?'
// const questions = await structuredModel.invoke([
//   new SystemMessage(system),
//   new HumanMessage(question),
// ])

// console.log(questions.questions )
