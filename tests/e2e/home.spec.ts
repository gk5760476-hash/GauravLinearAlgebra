import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ui } from '../../src/content/en/ui';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows the app name and renders maths notation', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: ui.appName })).toBeVisible();
  await expect(page.locator('.katex').first()).toBeVisible();
});

test('has no automatically detectable accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('fits the screen without horizontal scrolling', async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
