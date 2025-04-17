'use client'
import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { PiMarkdownLogoLight, PiMarkdownLogoFill } from 'react-icons/pi'
import CodeMirror from '@uiw/react-codemirror'
import { markdown as markdownEtx, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import {
  useEditorStore,
  File as MarkdownFile,
  Category as MarkdownCategory,
} from '@/components/editorStore'
import { trackMetric } from '@/utils/metrics'
import titleize from '@/utils/titleize'
import Compiler from '@/utils/compiler'
import styles from './Editor.module.scss'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import plaintext from 'highlight.js/lib/languages/plaintext'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('python', python)
hljs.registerLanguage('plaintext', plaintext)

export function EditorWrapper({ files }: { files: Record<number, MarkdownFile> }) {
  const { setFiles, setActiveFile, setPreviewShow, setMarkdownCompiler } = useEditorStore()

  useEffect(() => {
    setFiles(files)
    for (const id in files) {
      if (files[id].title === 'Resume.md') {
        setActiveFile(Number(id))
        break
      }
    }
    ;(async () => {
      setMarkdownCompiler(await Compiler.create())
      requestAnimationFrame(() => setPreviewShow(true))
    })()
  }, [files, setFiles, setActiveFile, setPreviewShow, setMarkdownCompiler])

  return <Editor />
}

export function Editor() {
  return (
    <div data-testid="editor" className={styles.editor}>
      <TitleBar />
      <div className={styles.mainContainer}>
        <Sidebar />
        <div className={styles.toolbarAndPanesContainer}>
          <Toolbar />
          <div className={styles.panesContainer}>
            <EditorPane />
            <PreviewPane />
          </div>
        </div>
      </div>
      <FooterBar />
    </div>
  )
}

function TitleBar() {
  return (
    <div data-testid="editor-title-bar" className={styles.titleBar}>
      <div className={styles.left}>
        <div className={`${styles.circle} ${styles.close}`}></div>
        <div className={`${styles.circle} ${styles.minimize}`}></div>
        <div className={`${styles.circle} ${styles.full}`}></div>
      </div>
      <div></div>
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

    const pinnedOrder = ['Resume.md']
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
      {categoryOrder.map((category, index) => (
        <div key={category}>
          {index === 0 ? null : <div className={styles.categorySpacer}></div>}
          <div className={styles.category}>{titleize(category)}</div>
          <div className={styles.categoryDivider}></div>
          {fileMap[category].map((file) => (
            <div
              key={file.id}
              className={`${styles.item} ${file.id == activeFileId ? styles.active : ''}`}
              onClick={() => {
                setActiveFile(file.id)
                trackMetric({ name: 'file_click_total', count: 1, labels: { category } })
              }}
            >
              <PiMarkdownLogoFill className={styles.markdownIcon} />
              <div className={styles.itemTitle}>{file.title}</div>
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
            <PiMarkdownLogoLight className={styles.markdownIcon} />
            {file.title}
            <HiXMark
              data-testid={`close-${file.title}`}
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDraft(activeContent)
  }, [activeContent])

  return (
    <div data-testid="editor-editor-pane" className={styles.editorPane}>
      <CodeMirror
        className={styles.codeMirror}
        value={activeContent}
        height="100%"
        width="100%"
        theme="dark"
        extensions={[
          markdownEtx({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
        ]}
        onChange={(value) => {
          setDraft(value)

          // debounce
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => setActiveContent(value), DEBOUNCE_MS)
        }}
        onBlur={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current) // make sure were not setting stale data
          setActiveContent(draft)
        }}
      />
    </div>
  )
}

function PreviewPane() {
  const { activeContent, previewShow, compileMarkdown } = useEditorStore()
  const previewRef = useRef<HTMLDivElement>(null)
  const compiledHtml = useMemo(
    () => compileMarkdown(activeContent),
    [activeContent, compileMarkdown]
  )

  useLayoutEffect(() => {
    const node = previewRef.current
    if (!node) return

    node.querySelectorAll('pre code').forEach((block) => {
      if (block.classList.contains('hljs')) return // already highlighted
      const lang = block.classList && block.classList[0]
      if (!lang) block.classList.add('language-plaintext')
      hljs.highlightElement(block as HTMLElement)
    })
  })

  return (
    <div
      ref={previewRef}
      data-testid="editor-preview-pane"
      className={`${styles.previewPane} ${previewShow ? styles.show : ''}`}
      dangerouslySetInnerHTML={{ __html: compiledHtml }}
    ></div>
  )
}

function FooterBar() {
  return <div data-testid="editor-footer-bar" className={styles.footerBar}></div>
}
