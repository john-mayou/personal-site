import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav.locator('text=john.dev')).toBeVisible()
  })
})
