import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatGroq } from '@langchain/groq'
import { RunnableLambda } from '@langchain/core/runnables'

// Define LLM instance
const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
})

const analysisPrompt = ChatPromptTemplate.fromTemplate(
  'is this a funny joke? {joke}'
)

const prompt = ChatPromptTemplate.fromTemplate('tell me a joke about {topic}')
const chain = prompt.pipe(llm).pipe(new StringOutputParser())

const composedChain = new RunnableLambda({
  func: async (input: { topic: string }) => {
    const result = await chain.invoke(input)
    return { joke: result }
  },
})
  .pipe(analysisPrompt)
  .pipe(llm)
  .pipe(new StringOutputParser())

const re = await composedChain.invoke({ topic: 'bears' })

console.log(re)

// const re = await chain.invoke({ topic: 'bears' })
// console.log(re)
