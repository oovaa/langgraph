import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'

// let loader = new CheerioWebBaseLoader(
//   'https://news.ycombinator.com/item?id=34817881',
//   {
//     selector: 'p',
//   }
// )

// console.log(await loader.load())

import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'

/// niiiccceee github reader
export const run = async () => {
  const loader = new GithubRepoLoader(
    'https://github.com/langchain-ai/langchainjs',

    {
      branch: 'main',
      recursive: false,
      unknown: 'warn',
      maxConcurrency: 5, // Defaults to 2
    }
  )
  const docs = await loader.load()
  console.log({ docs })
}

run()

// YT

import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube'

let loader = YoutubeLoader.createFromUrl(
  'https://www.youtube.com/watch?v=TLosoD249NA',
  {
    language: 'en',
    addVideoInfo: true,
  }
)

const docs = await loader.load()

console.log(docs)
