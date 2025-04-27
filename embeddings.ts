import { CohereEmbeddings } from '@langchain/cohere'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import type { Document } from '@langchain/core/documents'

const embeddingsModel = new CohereEmbeddings({ model: 'embed-v4.0' })

const vectorStore = new MemoryVectorStore(embeddingsModel)

const document1: Document = {
  pageContent: 'The powerhouse of the cell is the mitochondria',
  metadata: { source: 'https://example.com' },
}

const document2: Document = {
  pageContent: 'Buildings are made out of brick',
  metadata: { source: 'https://example.com' },
}

const document3: Document = {
  pageContent: 'Mitochondria are made out of lipids',
  metadata: { source: 'https://example.com' },
}

const documents = [document1, document2, document3]

await vectorStore.addDocuments(documents)

// const similaritySearchResults = await vectorStore.similaritySearchWithScore(
//   'construction'
// )

// const re = similaritySearchResults.filter((x) => x[1] > 0.2)

// for (const doc of re) {
//   console.log(`* ${doc[0].pageContent} [${JSON.stringify(doc[1], null)}]`)
// }

const retreiver = vectorStore.asRetriever({
  k: 1,
})

const re = await retreiver.invoke('construction')

console.log(re)
