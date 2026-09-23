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

  test('clicking a slot opens a popup to choose + or −', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sett inn tegn|Fill in Signs/i }).click();

    const secondSlot = page.locator('[data-sign-slot]').nth(1);
    await secondSlot.click();
    const popup = secondSlot.getByRole('dialog');
    await expect(popup).toBeVisible();

    // Choose minus (one rect)
    await popup.locator('[data-choose-sign="-"]').click();
    await expect(popup).toHaveCount(0);
    await expect(secondSlot.locator('svg rect')).toHaveCount(1);

    // Reopen and choose plus (two rects)
    await secondSlot.click();
    await secondSlot.locator('[data-choose-sign="+"]').click();
    await expect(secondSlot.locator('svg rect')).toHaveCount(2);

    // Clicking outside closes the popup without changing the sign
    await secondSlot.click();
    await expect(secondSlot.getByRole('dialog')).toBeVisible();
    await page.locator('h2').click();
    await expect(secondSlot.getByRole('dialog')).toHaveCount(0);
    await expect(secondSlot.locator('svg rect')).toHaveCount(2);
  });

  test('counts attempts and reports them when all tasks are solved', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Sett inn tegn|Fill in Signs/i }).click();

    const rows = page.locator('[data-sign-row]');
    const rowCount = await rows.count();
    let wrongAttempts = 0;

    for (let r = 0; r < rowCount; r++) {
      const row = rows.nth(r);
      const slots = row.locator('[data-sign-slot]');
      const n = await slots.count();
      const current: (string | null)[] = new Array(n).fill(null);
      const isSolved = async () => (await row.getByText('check_circle').count()) > 0;
      // Try sign combinations until the row turns green (it locks once solved)
      for (let combo = 0; combo < 2 ** n && !(await isSolved()); combo++) {
        for (let s = 0; s < n && !(await isSolved()); s++) {
          const sign = (combo >> s) & 1 ? '-' : '+';
          const unchanged = current[s] === sign;
          current[s] = sign;
          await slots.nth(s).click();
          await slots.nth(s).locator(`[data-choose-sign="${sign}"]`).click();
          // Re-picking the same sign is not a new attempt
          if (!unchanged && (await row.getByText('cancel').count())) wrongAttempts++;
        }
      }
      // Solved rows ignore clicks: no popup opens
      await slots.first().click();
      await expect(slots.first().getByRole('dialog')).toHaveCount(0);
    }

    await expect(page.getByTestId('sign-puzzle-attempts')).toBeVisible();
    // One correct attempt per task plus every wrong one
    const text = await page.getByTestId('sign-puzzle-attempts').innerText();
    const count = Number(text.match(/\d+/)![0]);
    expect(count).toBe(rowCount + wrongAttempts);
  });
});
