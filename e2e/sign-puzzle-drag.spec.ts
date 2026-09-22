import { test, expect } from '@playwright/test';

test.describe('Sign Puzzle Drag and Drop', () => {
  test('can switch to sign puzzle mode and drag plus sign into slot', async ({ page }) => {
    await page.goto('/');

    // Switch to Sett inn tegn mode
    const modeBtn = page.getByRole('button', { name: /Sett inn tegn|Fill in Signs/i });
    await modeBtn.click();

    // Verify title is visible
    await expect(page.locator('h2')).toContainText(/Matteoppgave|Math Task/i);

    // Get draggable plus token (the first of the two sign pieces)
    const plusToken = page.locator('[draggable="true"]').first();
    await expect(plusToken).toBeVisible();

    // Find the first slot
    const firstSlot = page.locator('[data-sign-slot]').first();
    await expect(firstSlot).toBeVisible();

    // Drag plusToken to firstSlot
    await plusToken.dragTo(firstSlot);

    // The signs are SVG glyphs, so assert the slot is filled rather than its text
    await expect(firstSlot.locator('svg rect')).toHaveCount(2);
  });

  test('can click to cycle signs in slot', async ({ page }) => {
    await page.goto('/');

    // Switch to Sett inn tegn mode
    const modeBtn = page.getByRole('button', { name: /Sett inn tegn|Fill in Signs/i });
    await modeBtn.click();

    const secondSlot = page.locator('[data-sign-slot]').nth(1);
    await expect(secondSlot).toBeVisible();

    // First click -> '+' (plus glyph = two rects)
    await secondSlot.click();
    await expect(secondSlot.locator('svg rect')).toHaveCount(2);

    // Second click -> '−' (minus glyph = one rect)
    await secondSlot.click();
    await expect(secondSlot.locator('svg rect')).toHaveCount(1);

    // Third click -> empty
    await secondSlot.click();
    await expect(secondSlot.locator('svg')).toHaveCount(0);
  });
});
