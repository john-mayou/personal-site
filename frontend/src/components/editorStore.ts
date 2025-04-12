import { create } from 'zustand'
import Compiler from '@/utils/compiler'

export type Category = 'general' | 'leetcode'

export type File = {
  id: number
  name: string
  title: string
  category: string
  content: string
}

type EditorState = {
  files: Record<number, File>
  activeFileId: number | null
  activeContent: string

  setFiles: (files: Record<number, File>) => void
  setActiveFile: (id: number | null) => void
  setActiveContent: (content: string) => void
  saveActiveFile: () => void

  compileMarkdown: (markdown: string) => string
  setMarkdownCompiler: (compiler: Compiler) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: {},
  activeFileId: null,
  activeContent: '',

  setFiles: (files) => {
    set({ files })
  },

  setActiveFile: (id) => {
    get().saveActiveFile()
    set({
      activeFileId: id,
      activeContent: id ? (get().files[id]?.content ?? '') : '',
    })
  },

  setActiveContent: (content) => {
    set({ activeContent: content })
  },

  saveActiveFile: () => {
    const { activeFileId, activeContent, files } = get()
    if (!activeFileId) return
    set({
      files: {
        ...files,
        [activeFileId]: {
          ...files[activeFileId],
          content: activeContent,
        },
      },
    })
  },

  compileMarkdown: () => '',

  setMarkdownCompiler: (compiler) =>
    set({
      compileMarkdown: (md) => compiler.compile(md),
    }),
}))
