import { test, expect } from '@playwright/test';

test.describe('Print matches preview', () => {
  test('task content in print mode matches screen preview', async ({ page }) => {
    await page.goto('/');

    // Wait for tasks to render
    await page.waitForSelector('.printable-sheet');

    // Get task text content in screen mode
    const getTaskTexts = () =>
      page.$$eval('.printable-sheet .grid > div', rows =>
        rows.map(row => row.textContent?.replace(/\s+/g, ' ').trim() ?? '')
      );

    const screenTexts = await getTaskTexts();
    expect(screenTexts.length).toBeGreaterThan(0);

    // Controls panel should be visible in screen mode
    const controls = page.locator('.no-print').first();
    await expect(controls).toBeVisible();

    // Switch to print media
    await page.emulateMedia({ media: 'print' });

    // Controls should be hidden in print mode
    await expect(controls).toBeHidden();

    // Task content should be identical in print mode
    const printTexts = await getTaskTexts();
    expect(printTexts).toEqual(screenTexts);
  });

  test('digit row visibility is preserved in print mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.printable-sheet');

    // Check if digit row is visible on screen
    const digitRow = page.locator('.font-handwritten').first();
    const isDigitRowVisible = await digitRow.isVisible();

    await page.emulateMedia({ media: 'print' });

    // Digit row visibility should match in print mode
    if (isDigitRowVisible) {
      await expect(digitRow).toBeVisible();
    } else {
      await expect(digitRow).toBeHidden();
    }
  });

  test('each task row contains an operator and equals sign', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.printable-sheet');

    // Task rows are the grid items with grid-cols-[2fr_auto_2fr_auto_1fr]
    const taskTexts = await page.$$eval(
      '.printable-sheet [class*="grid-cols-\\[2fr"]',
      rows => rows.map(r => r.textContent ?? '')
    );

    expect(taskTexts.length).toBe(5);
    const operatorPattern = /[+\u2212\u00d7\u00f7]/; // +, −, ×, ÷
    for (const text of taskTexts) {
      expect(text).toMatch(operatorPattern);
      expect(text).toContain('=');
    }
  });

  test('print preview frame dimensions match A4 aspect ratio', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.print-preview-frame');

    const box = await page.locator('.print-preview-frame').boundingBox();
    expect(box).toBeTruthy();

    if (box) {
      const ratio = box.height / box.width;
      // A4 ratio is 297/210 ≈ 1.414, allow some tolerance
      expect(ratio).toBeGreaterThan(1.3);
      expect(ratio).toBeLessThan(1.55);
    }
  });
});
