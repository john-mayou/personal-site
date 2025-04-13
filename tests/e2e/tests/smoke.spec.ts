import { test, expect } from '@playwright/test'

test.describe('Smoke', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('john.dev')
  })

  test('has healthy status', async ({ page }) => {
    await page.goto('/')
    const health = page.locator('[data-testid="health-status"]')
    await expect(health).toContainText('{"status":"healthy"}')
  })
})
