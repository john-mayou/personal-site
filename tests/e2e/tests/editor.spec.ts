import { test, expect, Page, Locator, TestInfo } from '@playwright/test'
import dedent from 'dedent'

const fs = require('node:fs')
const path = require('node:path')
const sanitizeFilename = require('sanitize-filename')

const EDITOR_DEBOUNCE_MS = 55 // 50 + 5ms buffer

const isMac = process.platform === 'darwin'
const selectAllKey = isMac ? 'Meta+A' : 'Control+A'

const getSidebar = (page: Page) => page.getByTestId('editor-sidebar')
const getToolbar = (page: Page) => page.getByTestId('editor-toolbar')
const getEditor = (page: Page) => page.getByTestId('editor-editor-pane').locator('.cm-content')
const getPreview = (page: Page) => page.getByTestId('editor-preview-pane')

async function waitForLoad(page: Page) {
  await getPreview(page).locator('p').waitFor() // wait until compiler loads
}

async function assertScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const filename = sanitizeFilename(`${testInfo.title}_${name}`) + '.png'
  await expect(page).toHaveScreenshot(filename, { fullPage: true })
}

async function replaceEditorText(page: Page, editor: Locator, text: string) {
  await editor.click()
  await page.keyboard.press(selectAllKey)
  await page.keyboard.press('Backspace')
  await editor.fill(text)
  await page.waitForTimeout(EDITOR_DEBOUNCE_MS)
}

test.describe('Editor', () => {
  test('preview shows compiled html', async ({ page }, testInfo) => {
    await page.goto('/')
    await waitForLoad(page)

    await assertScreenshot(page, testInfo, 'editor-on-load')

    await replaceEditorText(page, getEditor(page), '# Hello world')
    await expect(getPreview(page).locator('h1', { hasText: 'Hello world' })).toBeVisible()
  })

  test('tab switching + close/reopen preserves editor state', async ({ page }, testInfo) => {
    await page.goto('/')
    await waitForLoad(page)

    // edit text
    const editor = getEditor(page)
    await replaceEditorText(page, editor, '# Hello world')

    // close and reopen Intro.md
    const toolbar = getToolbar(page)
    await toolbar.getByTestId('close-Intro.md').click()
    await expect(editor).not.toContainText('# Hello world')
    const sidebar = getSidebar(page)
    await sidebar.getByText('Intro.md').click()
    await expect(editor).toContainText('# Hello world')

    // edit text
    await replaceEditorText(page, editor, '# Hello world 2')

    // open another file and switch back to Intro.md
    await sidebar.getByText('Resume.md').click()
    await expect(editor).not.toContainText('# Hello world 2')
    await toolbar.getByText('Intro.md').click()
    await expect(editor).toContainText('# Hello world 2')
  })

  test('preview code syntax highlighting', async ({ page }, testInfo) => {
    await page.goto('/')
    await waitForLoad(page)

    const preview = getPreview(page)
    const assertSyntaxHighlightClasses = async () => {
      expect(preview.locator('code[class*="language-python"]')).toBeVisible()
    }

    // add code text
    const editor = getEditor(page)
    await replaceEditorText(
      page,
      editor,
      dedent`\`\`\`python
      class Klass:
        pass
      \`\`\``
    )
    await assertScreenshot(page, testInfo, 'after-code-text-added')
    await assertSyntaxHighlightClasses()

    // switch tabs and switch back
    await getSidebar(page).getByText('Resume.md').click()
    await getToolbar(page).getByText('Intro.md').click()
    await assertScreenshot(page, testInfo, 'after-tab-switch-and-switch-back')
    await assertSyntaxHighlightClasses()

    // add text that isnt code
    await editor.click()
    for (let i = 0; i < 2; i++) await page.keyboard.press('ArrowDown') // all the way to the bottom
    await page.keyboard.press('Enter')
    await page.keyboard.type('text')
    await page.waitForTimeout(EDITOR_DEBOUNCE_MS)
    await assertScreenshot(page, testInfo, 'after-non-code-text-added')
    await assertSyntaxHighlightClasses()

    // de-focus from editor (blur)
    await page.mouse.click(0, 0)
    await assertScreenshot(page, testInfo, 'after-editor-blur')
    await assertSyntaxHighlightClasses()
  })

  test('handles long + wide markdown content gracefully', async ({ page }, testInfo) => {
    await page.goto('/')
    await waitForLoad(page)

    // edit text
    const longWideMd = fs.readFileSync(
      path.resolve(__dirname, '../testdata/long-wide-markdown.md'),
      'utf-8'
    )
    await replaceEditorText(page, getEditor(page), longWideMd)

    await expect(getPreview(page)).toContainText('Lorem ipsum') // wait for preview
    await assertScreenshot(page, testInfo, 'with-oversize-markdown')
  })
})
