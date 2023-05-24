import { test, expect } from '@playwright/test';
import { selectors } from "./helpers/selectors";
import * as fs from "fs";

test.describe('<App/>', () => {
	test.beforeEach(async ({ page }, testInfo) => {
		console.log('testInfo', testInfo.title);
		await page.goto('/');
	});

	test('renders initially', async ({ page }) => {
		const header = page.locator(selectors.logoutButton, { hasText: "Sign Out" });
		await expect(header).toBeVisible();
	});

	test.skip('Additional Unhappy Path Tests', () => {
		test('Add a test for headers that we do not allow and validate the correct error response', () => {});
		test('Add a test for the expected error response for an invalid session', () => {});
		test('Nice to have: Review Datadog / SDK usage, add any additional tests for errors we see there ', () => {});
	});
});
