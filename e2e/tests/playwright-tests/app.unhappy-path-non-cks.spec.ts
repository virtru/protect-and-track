import { test, expect } from '@playwright/test';
import { selectors } from "./helpers/selectors";
import { encryptDecryptProcedure } from "./helpers/operations";
import * as fs from "fs/promises";

test.describe.configure({ mode: 'serial' });

let fileName;

test.describe('Unhappy paths Non CKS user', () => {
	test('Encrypt data B with user W, a non-CKS user using the JS SDK', async ({ page, browser }) => {
		// DO NOT entitle anyone else. Y and Z cannot decrypt B_W
		const contextW = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-non-cks/user1.json' }); // W
		const pageW = await contextW.newPage();
		await pageW.goto('/');

		await encryptDecryptProcedure({
			page: pageW,
		});
		const downloadPromiseW = pageW.waitForEvent('download');
		await pageW.getByText(selectors.downloadFileBtnText).click();
		await pageW.getByText(selectors.downloadTDFFileBtnText).click();
		const downloadW = await downloadPromiseW;
		fileName = downloadW.suggestedFilename();

		await downloadW.saveAs(fileName);
		await contextW.close();

		const contextZ = await browser.newContext({ storageState: 'e2e/tests/playwright-tests/.auth-cks/user.json' });
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
		await expect(responsePublicKeyY.status() === 403).toBeTruthy();
		await fs.rm(fileName);
		await contextY.close();
	});
});
