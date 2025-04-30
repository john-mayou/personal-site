import { create } from 'zustand'

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
  previewShow: boolean

  setFiles: (files: Record<number, File>) => void
  setActiveFile: (id: number | null) => void
  setActiveContent: (content: string) => void
  saveActiveFile: () => void
  setPreviewShow: (open: boolean) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: {},
  activeFileId: null,
  activeContent: '',
  previewShow: false,

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

  setPreviewShow: (open) => {
    set({ previewShow: open })
  },
}))
