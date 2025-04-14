import { CohereEmbeddings } from '@langchain/cohere'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables'
import { Document } from '@langchain/core/documents'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import llm from './llm.ts'

const model = llm
const vectorstore = await MemoryVectorStore.fromDocuments(
  [{ pageContent: 'mitochondria is the powerhouse of the cell', metadata: {} }],
  new CohereEmbeddings({ model: 'embed-english-v3.0' })
)

const retriever = vectorstore.asRetriever()
const template = `Answer the question based only on the following context:
{context}

Question: {question}`

const prompt = PromptTemplate.fromTemplate(template)

const formatDocs = (docs: Document[]) => docs.map((doc) => doc.pageContent)

const retrievalChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },

  prompt,
  model,
  // (prevResult) => console.log(prevResult),
  new StringOutputParser(),
])

const result = await retrievalChain.invoke(
  'what is the powerhouse of the cell?'
)
console.log(result)

/*
 Based on the given context, the powerhouse of the cell is mitochondria.
*/

// import llm from './llm.ts'
// import { PromptTemplate } from '@langchain/core/prompts'
// import { RunnableMap } from '@langchain/core/runnables'

// const model = llm
// const jokeChain = PromptTemplate.fromTemplate(
//   'Tell me a joke about {topic}'
// ).pipe(model)
// const poemChain = PromptTemplate.fromTemplate(
//   'write a 2-line poem about {topic}'
// ).pipe(model)

// const mapChain = RunnableMap.from({
//   joke: jokeChain,
//   poem: poemChain,
// })

// const result = await mapChain.invoke({ topic: 'bear' })
// console.log(result.joke)
// /*
//   {
//     joke: AIMessage {
//       content: " Here's a silly joke about a bear:\n" +
//         '\n' +
//         'What do you call a bear with no teeth?\n' +
//         'A gummy bear!',
//       additional_kwargs: {}
//     },
//     poem: AIMessage {
//       content: ' Here is a 2-line poem about a bear:\n' +
//         '\n' +
//         'Furry and wild, the bear roams free  \n' +
//         'Foraging the forest, strong as can be',
//       additional_kwargs: {}
//     }
//   }
// */
