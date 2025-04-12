import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { File, Category } from '../components/editorStore'

const contentDir = path.join(process.cwd(), 'content')

export function loadContentFiles(): Record<number, File> {
  const filenames = fs.readdirSync(contentDir)

  const createTitle = (filename: string, category: Category): string => {
    switch (category) {
      case 'general':
        return filename
      case 'leetcode':
        const [number, ...titleParts] = filename.split('_')
        return `${number}. ${titleParts.join(' ')}`
      default:
        throw new Error(`Invalid file category: ${category}`)
    }
  }

  let id = 1
  const result: Record<number, File> = {}

  for (const filename of filenames) {
    const filePath = path.join(contentDir, filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    result[id] = {
      id,
      name: filename,
      title: createTitle(filename, data.category),
      category: data.category,
      content,
    }

    id++
  }

  return result
}
