import { MistralAI } from '@langchain/mistralai'

// List of models to test
const modelsToTest = [
  'codestral-latest', // this works
  //   'mistral-large-latest',
  //   'pixtral-large-latest',
  //   'mistral-saba-latest',
  //   'ministral-3b-latest',
  //   'ministral-8b-latest',
  //   'mistral-embed',
  //   'mistral-moderation-latest',
  //   'mistral-ocr-latest',
  //   'mistral-small-latest',
  //   'pixtral-12b-2409',
  //   'open-mistral-nemo',
  //   'open-codestral-mamba',
  //   'open-mixtral-8x7b',
  //   'open-mixtral-8x22b',
  //   'mistral-medium-2312',
  //   'mistral-small-2402',
  //   'mistral-large-2402',
  //   'mistral-large-2407',
  'codestral-2405', // coding
]

async function testModel(modelName) {
  try {
    const llm = new MistralAI({
      model: modelName,
      temperature: 0,
    })

    const inputText = 'MistralAI is an AI company that '
    await llm.invoke(inputText)
    console.log(`Model ${modelName}: ✅ Worked`)
  } catch (error) {
    console.log(`Model ${modelName}: ❌ Error`)
  }
}

// Run all tests sequentially
async function runTests() {
  for (const model of modelsToTest) {
    await testModel(model)
  }
}

runTests()
