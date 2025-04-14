import {
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatGroq } from '@langchain/groq'
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables'
import { z } from 'zod'

// Define LLM instance
const llm = new ChatGroq({
  model: 'llama3-70b-8192', // Updated model name
  temperature: 0,
})

const zz = z.object({
  joke: z.string().describe('the joke'),
})

const analysisPrompt = ChatPromptTemplate.fromTemplate(
  'is this a funny joke? {joke}'
)

// Update prompt to include format instructions
const prompt = ChatPromptTemplate.fromTemplate(`
  Tell me a joke about {topic}. Make it in one line.
  {format_instructions}
`)

const jokeParser = StructuredOutputParser.fromZodSchema(zz)
const formatInstructions = jokeParser.getFormatInstructions()

const chain = prompt.pipe(llm).pipe(jokeParser)
const analysisChain = RunnableSequence.from([
  analysisPrompt,
  llm,
  new StringOutputParser(),
])

const composedChain = RunnableSequence.from([
  chain,
  analysisChain,
  // (prevResult) => console.log(prevResult),
])

const re = await composedChain.invoke({
  topic: 'bears',
  format_instructions: formatInstructions,
})

console.log(re)

//// playing around

// const lambda = new RunnableLambda({
//   func: (x) => {
//     console.log(x)

//     return x
//   },
// })

// const h = await lambda.batch([1, 2, 3, 5])

// console.log(h)

// const re = await chain.invoke({ topic: 'bears' })
// console.log(re)
