import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useEditorStore } from './editorStore'
import { Editor } from './Editor'

jest.mock('@uiw/react-codemirror')

const mockFiles = {
  1: {
    id: 1,
    name: 'Intro.md',
    category: 'general',
    title: 'Intro.md',
    content: 'Intro content',
  },
  2: {
    id: 2,
    name: 'Resume.md',
    category: 'general',
    title: 'Resume.md',
    content: 'Resume content',
  },
}

let user: ReturnType<typeof userEvent.setup>

beforeEach(() => {
  Object.defineProperty(navigator, 'sendBeacon', { value: jest.fn(), writable: true })

  user = userEvent.setup()
  useEditorStore.setState({
    files: mockFiles,
    activeFileId: 1,
    activeContent: mockFiles[1].content,
    compileMarkdown: (md) => md,
  })
  render(<Editor />)
})

const getSidebar = () => screen.getByTestId('editor-sidebar')
const getToolbar = () => screen.getByTestId('editor-toolbar')
const getEditor = () =>
  within(screen.getByTestId('editor-editor-pane')).getByTestId('mock-codemirror')
const getPreview = () => screen.getByTestId('editor-preview-pane')
const getEditorUI = () => ({
  sidebar: getSidebar(),
  toolbar: getToolbar(),
  editor: getEditor(),
  preview: getPreview(),
})

test('typing in editor updates preview', async () => {
  const { editor, preview } = getEditorUI()

  // clear input
  await user.clear(editor)
  expect(preview).toBeEmptyDOMElement()

  // new input
  await user.type(editor, 'Hello world')
  expect(preview).toHaveTextContent('Hello world')
})

test('persists changes when changing between tabs', async () => {
  const { sidebar, toolbar, editor, preview } = getEditorUI()

  // new input
  await user.clear(editor)
  await user.type(editor, 'Hello world')

  // open new file (new tab)
  await user.click(within(sidebar).getByText('Resume.md'))

  // click back to original tab
  await user.click(within(toolbar).getByText('Intro.md'))

  expect(editor).toHaveValue('Hello world')
  expect(preview).toHaveTextContent('Hello world')
})

test('persists changes when closing and reopening a file', async () => {
  const { sidebar, toolbar, editor, preview } = getEditorUI()

  // new input
  await user.clear(editor)
  await user.type(editor, 'Hello world')

  // close tab
  await user.click(within(toolbar).getByTestId('close-Intro.md'))
  expect(editor).toHaveValue('')

  // open file back up
  await user.click(within(sidebar).getByText('Intro.md'))
  expect(editor).toHaveValue('Hello world')
  expect(preview).toHaveTextContent('Hello world')
})

test('closing a tab switches to next tab', async () => {
  const { sidebar, toolbar, editor, preview } = getEditorUI()

  // open another file
  await user.click(within(sidebar).getByText('Resume.md'))
  expect(editor).toHaveValue('Resume content')

  // close file that was just opened
  await user.click(within(toolbar).getByTestId('close-Resume.md'))
  expect(editor).toHaveValue('Intro content')
  expect(preview).toHaveTextContent('Intro content')
})

test('closing the last tab shows no content', async () => {
  const { toolbar, editor, preview } = getEditorUI()

  // close only tab
  await user.click(within(toolbar).getByTestId('close-Intro.md'))
  expect(editor).toHaveValue('')
  expect(preview).toHaveTextContent('')
})

test('can still open a file after closing all tabs', async () => {
  const { sidebar, toolbar, editor, preview } = getEditorUI()

  // close only tab
  await user.click(within(toolbar).getByTestId('close-Intro.md'))

  // open new file
  await user.click(within(sidebar).getByText('Resume.md'))
  expect(editor).toHaveValue('Resume content')
  expect(preview).toHaveTextContent('Resume content')
})

test('opening the same file does not duplicate tabs', async () => {
  const { sidebar, toolbar } = getEditorUI()

  // open resume x3
  await user.click(within(sidebar).getByText('Resume.md'))
  await user.click(within(sidebar).getByText('Resume.md'))
  await user.click(within(sidebar).getByText('Resume.md'))

  expect(within(toolbar).getAllByText('Resume.md').length).toBe(1)
})
