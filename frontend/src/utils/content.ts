import fs from 'fs/promises'
import path from 'path'
import titleize from './titleize'
import { File } from '../components/editorStore'

// make sure these down overlap
const GENERAL_ID_START = 1
const LEETCODE_ID_START = 100

export async function loadAllContentFiles(): Promise<Record<number, File>> {
  const [general, leetcode] = await Promise.all([
    loadGeneralContentFiles(),
    loadLeetcodeContentFiles(),
  ])
  return { ...general, ...leetcode }
}

export async function loadGeneralContentFiles(): Promise<Record<number, File>> {
  const contentDir = path.join(process.cwd(), 'public/content/general')
  const problemDirs = await fs.readdir(contentDir)

  const files = await Promise.all(
    problemDirs.map(async (problemDir, i) => {
      const content = await fs.readFile(path.join(contentDir, problemDir, 'README.md'), 'utf-8')
      return {
        id: i + GENERAL_ID_START,
        name: problemDir,
        title: `${titleize(problemDir)}.md`,
        category: 'general',
        content,
      }
    })
  )

  const fileMap: Record<number, File> = {}
  for (const file of files) {
    fileMap[file.id] = file
  }

  return fileMap
}

export async function loadLeetcodeContentFiles(): Promise<Record<number, File>> {
  const contentDir = path.join(process.cwd(), 'public/content/leetcode')
  const problemDirs = await fs.readdir(contentDir)

  function createTitle(filename: string): string {
    const [number, ...parts] = filename.split('-')
    return `${number}. ${titleize(parts.join(' '))}.md`
  }

  const files = await Promise.all(
    problemDirs.map(async (problemDir, i) => {
      const content = await fs.readFile(path.join(contentDir, problemDir, 'README.md'), 'utf-8')
      return {
        id: i + LEETCODE_ID_START,
        name: problemDir,
        title: createTitle(problemDir),
        category: 'leetcode',
        content,
      }
    })
  )

  const fileMap: Record<number, File> = {}
  for (const file of files) {
    fileMap[file.id] = file
  }

  return fileMap
}
