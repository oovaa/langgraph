import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'
import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube'
import { Document } from 'langchain/document'

interface LoaderResults {
  success: boolean
  data?: Document[]
  error?: string
  metadata?: Record<string, any>
}

/**
 * Enhanced YouTube loader with better error handling
 */
export async function loadYoutubeTranscript(
  videoUrl: string,
  options: { language?: string; addVideoInfo?: boolean } = {}
): Promise<LoaderResults> {
  try {
    const loader = await YoutubeLoader.createFromUrl(videoUrl, {
      language: 'en',
      addVideoInfo: true,
      ...options,
    })
    const docs = await loader.load()

    // Extract video info safely
    const videoInfo = docs[0]?.metadata?.videoInfo || {}
    const title = videoInfo.title || 'Title not available'

    return {
      success: true,
      data: docs,
      metadata: {
        title,
        duration: videoInfo.duration,
        viewCount: videoInfo.view_count,
      },
    }
  } catch (error: any) {
    console.error('YouTube loader error:', error.message)
    return {
      success: false,
      error: error.message,
      metadata: {
        warning:
          'YouTube.js parser may need updating - see https://github.com/LuanRT/YouTube.js',
      },
    }
  }
}

/**
 * Enhanced GitHub repo loader
 */
export async function loadGithubRepository(
  repoUrl: string,
  options: {
    branch?: string
    recursive?: boolean
    unknown?: 'warn' | 'error' | 'ignore'
    maxConcurrency?: number
  } = {}
): Promise<LoaderResults> {
  try {
    const loader = new GithubRepoLoader(repoUrl, {
      branch: 'main',
      recursive: false,
      unknown: 'warn',
      maxConcurrency: 5,
      ...options,
    })
    const docs = await loader.load()

    return {
      success: true,
      data: docs,
      metadata: {
        fileCount: docs.length,
        fileTypes: [
          ...new Set(docs.map((d) => d.metadata.source.split('.').pop())),
        ],
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Enhanced webpage content loader
 */
export async function loadWebpageContent(
  url: string,
  options: { selector?: string } = {}
): Promise<LoaderResults> {
  try {
    const loader = new CheerioWebBaseLoader(url, options)
    const docs = await loader.load()

    return {
      success: true,
      data: docs,
      metadata: {
        paragraphCount: docs.length,
        firstParagraph: docs[0]?.pageContent.substring(0, 100) + '...',
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Main demonstration function with improved logging
 */
async function demonstrateLoaders() {
  console.log('Starting loader demonstration...')

  // 1. Load GitHub repo
  const githubResult = await loadGithubRepository(
    'https://github.com/langchain-ai/langchainjs'
  )
  console.log(githubResult)

  console.log(
    githubResult.success
      ? `GitHub Success: Loaded ${githubResult.metadata?.fileCount} files`
      : `GitHub Error: ${githubResult.error}`
  )

  // 2. Load YouTube video
  const youtubeResult = await loadYoutubeTranscript(
    'https://www.youtube.com/watch?v=TLosoD249NA'
  )
  console.log(youtubeResult)

  console.log(
    youtubeResult.success
      ? `YouTube Success: Video "${youtubeResult.metadata?.title}" loaded`
      : `YouTube Error: ${youtubeResult.error}`
  )

  // 3. Load webpage content
  const webpageResult = await loadWebpageContent(
    'https://marketplace.visualstudio.com/items?itemName=OmarAbdo.hasanah',
    { selector: 'p' }
  )
  console.log(webpageResult)

  console.log(
    webpageResult.success
      ? `Webpage Success: Found ${webpageResult.metadata?.paragraphCount} paragraphs`
      : `Webpage Error: ${webpageResult.error}`
  )
}

// Execute with error handling
demonstrateLoaders().catch((err) => {
  console.error('Demonstration failed:', err)
  process.exit(1)
})
