import { test as setup } from '@playwright/test';
import { signInUser } from "../helpers/operations";
import { userAuthData } from '../config';

setup('authenticate 1', async ({ page }) => {
	const { nonCKS: { user1 }, mainUser } = userAuthData;

	await signInUser(
		page,
		{
			email: user1.login,
			password: user1.password,
			recoveryEmail: mainUser.login,
		}
	);
	await page
		.context()
		.storageState({
			path: 'e2e/tests/playwright-tests/.auth-non-cks/user1.json'
		});
	await page.close();
});