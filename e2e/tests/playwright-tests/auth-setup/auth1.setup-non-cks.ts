import { test as setup } from '@playwright/test';
import { signInUser } from "../helpers/operations";
import { userAuthData } from '../config';

setup('authenticate', async ({ page }) => {
	const { nonCKS: { user1 }, mainUser } = userAuthData

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
			path: 'e2e/tests/playwright-test/.auth-non-cks/user1.json'
		});
});