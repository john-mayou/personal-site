import { test, expect, Page, Locator } from '@playwright/test'
const fs = require('node:fs')
const path = require('node:path')

const isMac = process.platform === 'darwin'
const selectAllKey = isMac ? 'Meta+A' : 'Control+A'

const getSidebar = (page: Page) => page.getByTestId('editor-sidebar')
const getToolbar = (page: Page) => page.getByTestId('editor-toolbar')
const getEditor = (page: Page) => page.getByTestId('editor-editor-pane').locator('.cm-content')
const getPreview = (page: Page) => page.getByTestId('editor-preview-pane')

async function waitForLoad(page: Page) {
  await getPreview(page).locator('p').waitFor() // wait until compiler loads
}

async function replaceEditorText(page: Page, editor: Locator, text: string) {
  await editor.click()
  await page.keyboard.press(selectAllKey)
  await page.keyboard.press('Backspace')
  await editor.fill(text)
}

test.describe('Editor', () => {
  test('preview shows compiled html', async ({ page }) => {
    await page.goto('/')
    await waitForLoad(page)

    await page.screenshot({ path: 'screenshots/page-on-load.png', fullPage: true })

    await replaceEditorText(page, getEditor(page), '# Hello world')
    await expect(getPreview(page).locator('h1', { hasText: 'Hello world' })).toBeVisible()
  })

  test('tab switching + close/reopen preserves editor state', async ({ page }) => {
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

  test('handles long + wide markdown content gracefully', async ({ page }) => {
    await page.goto('/')
    await waitForLoad(page)

    // edit text
    const longWideMd = fs.readFileSync(
      path.resolve(__dirname, '../testdata/long-wide-markdown.md'),
      'utf-8'
    )
    await replaceEditorText(page, getEditor(page), longWideMd)

    await expect(getPreview(page)).toContainText('Lorem ipsum') // wait for preview
    await page.screenshot({ path: 'screenshots/long-wide-markdown.png', fullPage: true })
  })
})
