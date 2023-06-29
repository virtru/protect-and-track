import { test, expect } from '@playwright/test';
import { selectors } from "./helpers/selectors";
import { encryptAndDecrypt } from "./helpers/operations";

test.describe.configure({ mode: 'serial' });

let fileName;

test.describe('Unhappy paths CKS user', () => {
	test('Encrypt data A with a CKS user X, a CKS user using the JS SDK. DO NOT entitle anyone else.', async ({ browser }) => {
		const contextX = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user.json' });
		const pageX = await contextX.newPage();
		await pageX.goto('/');

		await encryptAndDecrypt({
			page: pageX,
		});

		const downloadPromiseX = pageX.waitForEvent('download');
		await pageX.getByText(selectors.downloadTDFFileBtnText).click();
		const downloadX = await downloadPromiseX;
		fileName = downloadX.suggestedFilename();
		await downloadX.saveAs(fileName);
		await contextX.close();

		const contextZ = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user3.json' });
		const pageZ = await contextZ.newPage();
		await pageZ.goto('/');
		await pageZ.locator(selectors.uploadInput).setInputFiles(fileName);

		const responsePublicKeyZ = await pageZ.waitForResponse('**/rewrap');
		await expect(responsePublicKeyZ.status() === 403).toBeTruthy();
		await contextZ.close();

		const contextY = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-non-cks/user2.json' });
		const pageY = await contextY.newPage();
		await pageY.goto('/');
		await pageY.locator(selectors.uploadInput).setInputFiles(fileName);

		const responsePublicKeyY = await pageY.waitForResponse('**/rewrap');
		await expect(responsePublicKeyY.status()).toBe(403);
		await contextY.close();
	});
});
