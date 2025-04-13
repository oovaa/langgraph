import {
  CommaSeparatedListOutputParser,
  JsonOutputParser,
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatGroq } from '@langchain/groq'
import { z } from 'zod'

// Define LLM instance
const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,
})

// ====================
// 1. JSON Output Parser
// ====================
interface Joke {
  body: string
  explanation: string
  rating: number
  tags: string[]
}

async function callJsonOutputParser() {
  const jsonParser = new JsonOutputParser<Joke>()

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a comedian AI. Generate jokes in JSON format about the given topic.
      Format instructions: ${jsonParser.getFormatInstructions()}
      Include at least 4 tags with each joke.`,
    ],
    ['user', '{topic}'],
  ])

  const chain = RunnableSequence.from([prompt, llm, jsonParser])

  const response = await chain.invoke({
    topic: 'programmers',
  })

  console.log('JSON Parser Result:', response)
}

// =====================
// 2. String Output Parser
// =====================
async function callStringOutputParser() {
  const stringParser = new StringOutputParser()

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a helpful assistant.'],
    [
      'user',
      'Explain quantum computing to a 5-year-old in exactly {words} words.',
    ],
  ])

  const chain = RunnableSequence.from([prompt, llm, stringParser])

  const response = await chain.invoke({
    words: 50,
  })

  console.log('String Parser Result:', response)
}

// ==========================
// 3. List Output Parser
// ==========================
async function callListOutputParser() {
  const listParser = new CommaSeparatedListOutputParser()

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'Generate items separated by commas. Do not number them.'],
    ['user', 'Suggest {count} {itemType} names separated by commas'],
  ])

  const chain = RunnableSequence.from([prompt, llm, listParser])

  const response = await chain.invoke({
    count: 5,
    itemType: 'sci-fi spaceships',
  })

  console.log('List Parser Result:', response)
}

// ==========================
// 4. Structured Output Parser
// ==========================
async function callStructuredOutputParser() {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    name: 'name of the person',
    age: 'age of the person as number',
    gender: 'gender (male/female/other)',
    hobbies: 'array of hobbies',
  })

  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract structured information from the following phrase.
    Format instructions: {format}
    Return ONLY the valid JSON object.
    
    Phrase: {phrase}
  `)

  const chain = RunnableSequence.from([prompt, llm, parser])

  const response = await chain.invoke({
    phrase:
      'Alex is a 28-year-old woman who enjoys hiking, painting, and coding',
    format: parser.getFormatInstructions(),
  })

  console.log('Structured Parser Result:', response)
}

// =====================
// 5. Zod Output Parser
// =====================
async function callZodOutputParser() {
  const schema = z.object({
    book: z.object({
      title: z.string().describe('title of the book'),
      author: z.string().describe('author name'),
      publishedYear: z.number().describe('year of publication'),
      genres: z.array(z.string()).describe('literary genres'),
      rating: z.number().min(1).max(5).describe('1-5 rating'),
    }),
    similarBooks: z.array(z.string()).describe('titles of similar books'),
  })

  const parser = StructuredOutputParser.fromZodSchema(schema)

  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract book information from the following description.
    Format instructions: {format}
    Return ONLY the valid JSON object.
    
    Description: {description}
  `)

  const chain = RunnableSequence.from([prompt, llm, parser])

  const response = await chain.invoke({
    description:
      'Dune by Frank Herbert, published in 1965, is a science fiction masterpiece with elements of political drama. It has a rating of 4.5. Similar books include Foundation and 1984.',
    format: parser.getFormatInstructions(),
  })

  console.log('Zod Parser Result:', response)
}

// Execute all examples
async function runAllExamples() {
  console.log('=== Running JSON Parser Example ===')
  await callJsonOutputParser()

  console.log('\n=== Running String Parser Example ===')
  await callStringOutputParser()

  console.log('\n=== Running List Parser Example ===')
  await callListOutputParser()

  console.log('\n=== Running Structured Parser Example ===')
  await callStructuredOutputParser()

  console.log('\n=== Running Zod Parser Example ===')
  await callZodOutputParser()
}

runAllExamples().catch(console.error)
