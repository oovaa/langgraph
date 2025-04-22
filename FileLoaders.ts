import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import * as path from 'path'

// Function to load DOCX files
async function loadDocxFile(filePath: string) {
  const loader = new DocxLoader(filePath)
  return await loader.load()
}

// Function to load CSV files
async function loadCsvFile(filePath: string, separator: string = '| ') {
  const loader = new CSVLoader(filePath, { separator })
  return await loader.load()
}

// Function to load JSON files
async function loadJsonFile(filePath: string) {
  // @ts-ignore
  const loader = new JSONLoader(filePath, ['/name']) // /name as to specify wiaht to load (default is all strings)

  return await loader.load()
}

// Main function to demonstrate usage
async function main() {
  try {
    // Load DOCX file
    let docs = await loadDocxFile('Darajat.docx')
    console.log('DOCX loaded:', docs)

    // Load CSV file
    const csvData = await loadCsvFile('./data.csv')
    console.log('CSV loaded:', csvData[1])

    // Load JSON file
    const jsonData = await loadJsonFile('./data.json')
    console.log('JSON loaded:', jsonData)
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

// Execute the main function
main()
