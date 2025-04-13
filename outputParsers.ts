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

interface Joke {
  body: string
  explanation: string
  rating: number
}

const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,
})

async function callStringOutputParser() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are an AI assistant that extracts a single piece of information.`,
    ],
    ['user', 'Extract the capital city of {country}.'],
  ])
  const parser = new StringOutputParser()
  const chain = RunnableSequence.from([prompt, llm, parser])
  const response = await chain.invoke({ country: 'France' })
  console.log('String Output Parser Response:', response)
  return response
}

async function callJsonOutputParser() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are an AI assistant that extracts information in JSON format.`,
    ],
    [
      'user',
      'Extract the body, explanation, and a rating (as a number) for the following joke:\n\n{joke}',
    ],
  ])
  const parser = new JsonOutputParser<Joke>()
  const chain = RunnableSequence.from([prompt, llm, parser])
  const response = await chain.invoke({
    joke: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
  })
  console.log('JSON Output Parser Response:', response)
  return response
}

async function callCommaSeparatedListOutputParser() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are an AI assistant that generates a comma-separated list.`,
    ],
    ['user', 'Suggest 5 {item} separated by commas.'],
  ])
  const parser = new CommaSeparatedListOutputParser()
  const chain = RunnableSequence.from([prompt, llm, parser])
  const response = await chain.invoke({ item: 'colors' })
  console.log('Comma Separated List Output Parser Response:', response)
  return response
}

async function callStructuredOutputParserFunction() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting instructions: {format}
    Phrase: {phrase}

    ## RETURN THE VALID JSON OBJECT AND NOTHING ELSE
  `)

  const structuredParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: 'the name of the person',
    age: 'the age of the person',
    gender: 'the gender of the person (male/female)',
  })
  const chain = RunnableSequence.from([prompt, llm, structuredParser])

  const res = await chain.invoke({
    phrase: 'Alice is a 30 year old woman.',
    format: structuredParser.getFormatInstructions(),
  })

  console.log('Structured Output Parser Response:', res)
  return res
}

async function callZodOutputParserFunction() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information about a recipe from the following phrase.
    Formatting instructions: {format}
    Phrase: {phrase}

    ## RETURN THE VALID JSON OBJECT AND NOTHING ELSE
  `)

  const zodSchema = z.object({
    recipeName: z.string().describe('the name of the recipe'),
    ingredients: z.array(z.string()).describe('a list of ingredients'),
    prepTime: z.string().describe('the preparation time'),
  })

  const zodParser = StructuredOutputParser.fromZodSchema(zodSchema)
  const chain = RunnableSequence.from([prompt, llm, zodParser])

  const res = await chain.invoke({
    phrase:
      'A delicious pasta carbonara with eggs, cheese, and pancetta takes about 20 minutes to prepare.',
    format: zodParser.getFormatInstructions(),
  })

  console.log('Zod Output Parser Response:', res)
  return res
}

// Example calls to each function:
callStringOutputParser()
callJsonOutputParser()
callCommaSeparatedListOutputParser()
callStructuredOutputParserFunction()
callZodOutputParserFunction()
