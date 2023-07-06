import { test as setup } from '@playwright/test';
import { signInUser } from "../helpers/operations";
import { userAuthData } from '../config/index';

setup('authenticate 2', async ({ page }) => {
	const { nonCKS: { user2 }, mainUser } = userAuthData;

	await signInUser(
		page,
		{
			email: user2.login,
			password: user2.password,
			recoveryEmail: mainUser.login,
		}
	);
	await page
		.context()
		.storageState({
			path: 'e2e/tests/playwright-tests/.auth-non-cks/user2.json'
		});
	await page.close();
});