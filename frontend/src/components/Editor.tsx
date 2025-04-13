'use client'
import { useEffect, useState, useMemo } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { PiMarkdownLogoLight, PiMarkdownLogoFill } from 'react-icons/pi'
import CodeMirror from '@uiw/react-codemirror'
import { markdown as codeMirrorMarkdownExt } from '@codemirror/lang-markdown'
import {
  useEditorStore,
  File as MarkdownFile,
  Category as MarkdownCategory,
} from '@/components/editorStore'
import titleize from '@/utils/titleize'
import Compiler from '@/utils/compiler'
import styles from './Editor.module.scss'

export function EditorWrapper({ files }: { files: Record<number, MarkdownFile> }) {
  const { setFiles, setActiveFile, setMarkdownCompiler } = useEditorStore()

  useEffect(() => {
    ;(async () => {
      setFiles(files)
      for (const id in files) {
        if (files[id].title === 'Intro.md') {
          setActiveFile(Number(id))
          break
        }
      }
      setMarkdownCompiler(await Compiler.create())
    })()
  }, [files, setFiles, setActiveFile, setMarkdownCompiler])

  return <Editor />
}

export function Editor() {
  return (
    <div data-testid="editor" className={styles.editor}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <Toolbar />
        <div className={styles.panesContainer}>
          <EditorPane />
          <PreviewPane />
        </div>
      </div>
    </div>
  )
}

const categoryOrder: MarkdownCategory[] = ['general', 'leetcode']

function Sidebar() {
  const { files, activeFileId, setActiveFile } = useEditorStore()
  const fileMap: Record<MarkdownCategory, MarkdownFile[]> = useMemo(() => {
    const map: Record<MarkdownCategory, MarkdownFile[]> = {
      general: [],
      leetcode: [],
    }

    for (const id in files) {
      const file = files[id]
      if (file.category in map) {
        map[file.category as MarkdownCategory].push(file)
      }
    }

    const pinnedOrder = ['Intro.md', 'Resume.md', 'Guide.md']
    const pinnedIndex: Record<string, number> = Object.fromEntries(
      pinnedOrder.map((name, i) => [name, i])
    )

    map.general.sort(
      (a, b) => (pinnedIndex[a.title] ?? Infinity) - (pinnedIndex[b.title] ?? Infinity)
    )
    map.leetcode.sort(
      (a, b) =>
        (parseInt(a.title.split('.')[0]) || Infinity) -
        (parseInt(b.title.split('.')[0]) || Infinity)
    )

    return map
  }, [files])

  return (
    <div data-testid="editor-sidebar" className={styles.sidebar}>
      {categoryOrder.map((category) => (
        <div key={category}>
          <div className={styles.category}>{titleize(category)}</div>
          {fileMap[category].map((file) => (
            <div
              key={file.id}
              className={`${styles.item} ${file.id == activeFileId ? styles.active : ''}`}
              onClick={() => setActiveFile(file.id)}
            >
              <PiMarkdownLogoFill />
              {file.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function Toolbar() {
  const { files, activeFileId, setActiveFile } = useEditorStore()
  const [openFileIds, setOpenFileIds] = useState<number[]>([])

  useEffect(() => {
    if (activeFileId) {
      setOpenFileIds((prev) => {
        if (prev.includes(activeFileId)) {
          return prev
        } else {
          const next = Array.from(prev)
          next.push(activeFileId)
          return next
        }
      })
    }
  }, [activeFileId])

  function closeTab(id: number) {
    const next = openFileIds.filter((v) => v !== id)
    setOpenFileIds(next)
    setActiveFile(next.length > 0 ? next[next.length - 1] : null)
  }

  return (
    <div data-testid="editor-toolbar" className={styles.toolbar}>
      {openFileIds.map((id) => {
        const file = files[id]
        if (!file) return null
        const isActive = id === activeFileId
        return (
          <div
            key={file.id}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => setActiveFile(id)}
          >
            <PiMarkdownLogoLight />
            {file.title}
            <HiXMark
              data-testid={`close-${file.name}`}
              className={`${styles.closeIcon} ${isActive ? '' : styles.inactive}`}
              onClick={(e) => {
                if (!isActive) return
                e.stopPropagation()
                closeTab(id)
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

const DEBOUNCE_MS = process.env.NODE_ENV === 'test' ? 1 : 50

function EditorPane() {
  const { activeContent, setActiveContent } = useEditorStore()
  const [draft, setDraft] = useState(activeContent)

  useEffect(() => {
    setDraft(activeContent)
  }, [activeContent])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveContent(draft)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout) // runs before next useEffect call
  }, [draft, setActiveContent])

  return (
    <div data-testid="editor-editor-pane" className={styles.editorPane}>
      <CodeMirror
        className={styles.codeMirror}
        value={activeContent}
        height="100%"
        width="100%"
        theme="dark"
        extensions={[codeMirrorMarkdownExt()]}
        onChange={setDraft}
        onBlur={() => setActiveContent(draft)}
      />
    </div>
  )
}

function PreviewPane() {
  const { activeContent, compileMarkdown } = useEditorStore()

  return (
    <div
      data-testid="editor-preview-pane"
      className={styles.previewPane}
      dangerouslySetInnerHTML={{ __html: compileMarkdown(activeContent) }}
    ></div>
  )
}
