import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/효도티어|부모님 탐구영역/i);
  });

  test('should have start button', async ({ page }) => {
    await page.goto('/');
    const startButton = page.getByRole('button', { name: /문제지 펼치기/i });
    await expect(startButton).toBeVisible();
  });

  test('Tailwind styles are applied', async ({ page }) => {
    await page.goto('/');
    const mainElement = page.locator('main');
    await expect(mainElement).toBeVisible();
  });
});
