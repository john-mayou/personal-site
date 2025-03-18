import { test, expect } from '@playwright/test'

test.describe('Counter App', () => {
  
  test('shows healthy status', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text={"status":"healthy"}')).toBeVisible()
  })

  test('increments and decrements counter', async ({ page }) => {
    await page.goto('/')

    const increments = await page.getByRole('button', { name: 'Increment' }).all()
    expect(increments.length).toBe(5)

    const firstCounter = increments[0].locator('xpath=../..')
    const increment = firstCounter.getByRole('button', { name: 'Increment' })
    const decrement = firstCounter.getByRole('button', { name: 'Decrement' })

    const counterText = firstCounter.locator('text=Count: 0')
    await expect(counterText).toBeVisible()

    await increment.click()
    await expect(firstCounter.locator('text=Count: 1')).toBeVisible()

    await decrement.click()
    await expect(firstCounter.locator('text=Count: 0')).toBeVisible()
  })

  test('takes a screenshot before and after incrementing', async ({ page }) => {
    await page.goto('/')
    const increments = await page.getByRole('button', { name: 'Increment' }).all()
    await page.screenshot({ path: 'screenshots/counter-before-increment.png' })
    await increments[0].click()
    await increments[1].click()
    await page.screenshot({ path: 'screenshots/counter-after-increment.png' })
  })

})
