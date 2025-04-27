import { CohereEmbeddings } from '@langchain/cohere'
const embeddingsModel = new CohereEmbeddings({ model: 'embed-v4.0' })
const embeddings = await embeddingsModel.embedDocuments([
  'Hi there!',
  'Oh, hello!',
  "What's your name?",
  'My friends call me World',
  'Hello World!',
])

console.log(`(${embeddings.length}, ${embeddings[0].length})`)
// (5, 1536)
