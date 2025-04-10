import { JsonOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatGroq } from '@langchain/groq'

// 2. Create the parser from the Zod schema
const parser = new JsonOutputParser()

// 3. Initialize the ChatGroq model
const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
})

// 4. Create the prompt using the format instructions
const prompt = ChatPromptTemplate.fromMessages([
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
  {
    role: 'user',
    content: `Please provide a brief technical comparison between chatbots and LLMs in JSON format. Use technical language.`,
  },
])

// 5. Create the chain
const chain = RunnableSequence.from([
  prompt,

  llm,
  // (prevResult) => console.log(prevResult),
  parser,
])

// 6. Invoke the chain and log result
const result = await chain.invoke({})
console.log(result)
