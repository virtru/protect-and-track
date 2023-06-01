import { Page, expect } from '@playwright/test'
import { selectors } from './selectors';
// import * as fs from 'fs';
import * as fs from 'fs/promises';

const gmail = {
    loginView: {
        identifierInput: '#identifierId',
        identifierNextBtn: '#identifierNext',
        passwordInput: 'input[type="password"]',
        passwordNextBtn: '#passwordNext',
    },
    verifyView: {
        recoveryEmailItem: 'div[data-challengetype="12"]',
        recoveryEmailInput: '#knowledge-preregistered-email-response',
        nextBtn: 'div:nth-of-type(1) > div > div > button[data-idom-class][type=button], button:has-text("Next")',
        notNowBtn: 'button[class]:has-text("Not now")',
    },
    activationElements: {
        popupActivateBtn: 'button.onboardv2__confirm:has-text("Activate")',
        popupOkBtn: 'div.popup-button.popup-button-blue:has-text("OK")',
        popupDoneBtn: 'button.onboardv2__confirm:has-text("Done")',
    },
    userAvatarBtn: 'a[aria-label*="Google Account:"]',
    search: {
        input: '#aso_search_form_anchor input[aria-label]',
        clearBtn: '#aso_search_form_anchor button[aria-label="Clear search"]',
        table: {
            row: 'div[role=main]:has(> div[style]) > div table[role=grid] > tbody > tr[jslog]',
        },
    },
    userIframe: {
        root: 'iframe[role="presentation"][src*="account"], iframe[role="presentation"][name="account"]',
        addAnotherAccountBtn: 'a[rel="noopener noreferrer"] div > div:has-text("Add another account")',
    },
    composeBtn: 'div[role=button]:has-text("Compose")',
    composer: {
        root: 'div.VIRTRU_GMAIL_MAIN_WRAPPER div[role=dialog]',
        newFeatureTipBtn: '.virtru-new-feature-tip-main-button',
        sendAnimation: 'table.virtru-send-animation-widget',
        protectionToggle: {
            stateOn: 'div.virtru-toggle.no-outline.virtru-on',
            stateOff: 'div.virtru-toggle.no-outline.virtru-off',
        },
        protectionSettingsBtn: 'div.virtru-pcm-button.no-outline',
        protectionSettingsOptions: {
            authToggle: '#virtru-pcm-option-noauth > div.virtru-pcm-option-toggle',
            authToggleOn: '#virtru-pcm-option-noauth > div.virtru-pcm-option-toggle.toggle-on',
            disableForwardToggle: '#virtru-pcm-option-forwarding > div.virtru-pcm-option-toggle',
            disableForwardToggleOn: '#virtru-pcm-option-forwarding > div.virtru-pcm-option-toggle.toggle-on',
            expirationToggle: '#virtru-pcm-option-expires > div.virtru-pcm-option-toggle',
            expirationToggleOn: '#virtru-pcm-option-expires > div.virtru-pcm-option-toggle.toggle-on',
            expirationInput: '#virtru-pcm-option-expires input',
            expirationUnit: '#virtru-pcm-option-expires select',
            requireSmsToggle: '#virtru-pcm-option-sms > div.virtru-pcm-option-toggle',
            requireSmsToggleOn: '#virtru-pcm-option-sms > div.virtru-pcm-option-toggle.toggle-on',
            watermarkToggle: '#virtru-pcm-option-watermark > div.virtru-pcm-option-toggle',
            watermarkToggleOn: '#virtru-pcm-option-watermark > div.virtru-pcm-option-toggle.toggle-on',
            pfpToggle: '#virtru-pcm-option-pfp > div.virtru-pcm-option-toggle',
            pfpToggleOn: '#virtru-pcm-option-pfp > div.virtru-pcm-option-toggle.toggle-on',
        },
        recipientInputOrg: '[name=to] input',
        recipientCcInputOrg: '[name=cc] input',
        recipientBccInputOrg: '[name=bcc] input',
        recipientPopupItemsOrg: 'div[style*=width] ul div[data-hovercard-owner-id]', // :has-text("<email_address>")
        recipientInputCom: 'textarea[name=to]',
        recipientCcInputCom: 'textarea[name=cc]',
        recipientBccInputCom: 'textarea[name=bcc]',
        recipientPopupItemsCom: '[role=listbox] > div[role][id] > div', // :has-text("<email_address>")
        ccBtn: 'span[data-tooltip*="Add Cc"]',
        bccBtn: 'span[data-tooltip*="Add Bcc"]',
        subjectInput: 'input[name=subjectbox]',
        messageInput: 'div[aria-label="Message Body"]', // > div:nth-of-type(1)', ??
        uploadFileInput: 'input[type=file]',
        uploadFileProgressFirst: '[role=progressbar][aria-label]',
        uploadFileProgressSecond: '[role=progressbar][aria-live]',
        uploadFileProgressDone: '.virtru-attachment-file-image',
        attachmentContent: {
            root: 'div.virtru-attachment-content', // :has-text("<file_name>.<ext>")
            removeBtn: 'div.virtru-attachment-delete',
            // if there are multiple files click should work with hovering on
            // div.virtru-attachment-content:has-text("<file_name>.<ext>") div.virtru-attachment-delete
        },
        secureSendBtn: 'div.virtru-send-secure',
        secureSendDisabled: 'div.disabled-send-secure-button',
        cautionCloseBtnOrg: 'div[aria-live=polite] > div[data-tooltip-contained="true"]',
    },
    leftPanel: {
        inboxBtn: 'a[aria-label*=Inbox]',
        sentBtn: 'a[aria-label*=Sent]',
    },
    table: {
        refreshBtn: 'div[class][gh] div[act="20"]',
        row: 'div[role=main] tr[role=row] span > span[data-thread-id]', // :has-text("<subject>")
        rowWithContent: 'div[role=main] r[role=row] > td[role=gridcell] > div > div > span', // :has-text("<subject>")
    },
    email: {
        backBtn: 'div[act="19"]',
        messagePanel: 'div[data-message-id]',
        unlockMessageBtn: 'a:has-text("Unlock Message")',
        verifyMeBtn: 'a:has-text("Verify me")',
        viewFilesBtn: 'a:has-text("View Files")',
        viewSecureFilesBtn: 'a:has-text("View Secure Files")',
        verificationCode: 'td:not([class])[align="center"] > span',
        revokeEnabledBtn: 'button.virtru-sender-revoke-button',
        revokeDisabledBtn: 'button.virtru-sender-disabled-revoke-button',
        reauthorizeEnabledBtn: 'button.virtru-sender-reauthorize-button',
        reauthorizeDisabledBtn: 'button.virtru-sender-disabled-reauthorize-button',
        secureMessage: {
            elementToHover: 'div.virtru-email-template-receiver-header',
            messageLine: 'div.virtru-email-template-receiver-body-enabled p',
            attachment: {
                container: 'div.virtru-attachment', // :has-text("<file_name.ext>.tdf")
                downloadBtn: 'div.download_icon',
                viewBtn: 'div.preview_icon_container',
            },
        },
    },
    annoyingPopup: {
        closeBtn: '[role=dialog] .promo-popup-header ~ div > button[aria-label=Close]',
        continueBtn: '[role=dialog] .promo-popup-header ~ div > button:has-text("Continue")',
        noThanksBtn: '[role=dialog] .promo-popup-header ~ div > button:has-text("No thanks")',
    },
    annoyingPopupInComposer: {
        protection: '.virtru-onboarding-modal-v2 .onboardv2__heading:has-text("Turn on Virtru protection")',
        options: '.virtru-onboarding-modal-v2 .onboardv2__heading:has-text("Add Security Options")',
        personal: '.virtru-onboarding-modal-v2 .onboardv2__heading:has-text("Personal Introduction")',
        okBtn: '.virtru-onboarding-popover button.onboardv2__okay',
        closeBtn: '.virtru-onboarding-popover button.tour-x-button',
    },
    annoyingPopupFirstMsg: {
        root: '#simplemodal-data',
        doneBtn: '#simplemodal-data .onboardv2__confirm',
    },
    annoyingBubbleInComposer: {
        dismissBtn: '[id*=bubble] [role=button]',
    },
    annoyingPopupInProtection: {
        dismissBtn: '.virtru-new-feature-tip-main-button',
    },
    annoyingPopupGoogleAd: {
        iframeName: 'callout',
        dontSwitchBtn: 'button[aria-label="Don\'t switch"]',
        closeBtn: 'button[aria-label="Don\'t switch"], button[aria-label="No thanks"], button[aria-label="No Thanks"]',
    },
    annoyingPopupGoogleSurvey: {
        iframeName: 'google-hats-survey',
        noThanksBtn: '[role=dialog][aria-label="User Survey"] button:has-text("No thanks"), [role=dialog][aria-label="User Survey"] button:has-text("close")',
    },
    annoyingPopupSuspectLink: {
        proceedBtn: '[role=alertdialog] button[name=sl]',
    },
};

export const signInUser = async (
  page: Page,
  userObject: { email: string, password: string, recoveryEmail: string },
  { selectorAwaited = undefined, checkInitialValue = false } = {}
) => {
    await page.goto('https://gmail.com', { waitUntil: 'commit' });

    if (checkInitialValue) {
        await expect(page.locator(gmail.loginView.identifierInput))
          .toHaveAttribute('data-initial-value', userObject.email, { timeout: 10000 });
    } else {
        await page.waitForSelector(gmail.loginView.identifierInput, { state: 'visible', timeout: 60000 });
        await page.locator(gmail.loginView.identifierInput).fill(userObject.email);
    }
    await page.locator(gmail.loginView.identifierNextBtn).click();
    await page.waitForSelector(gmail.loginView.passwordInput, { state: 'visible', timeout: 30000 });
    await page.locator(gmail.loginView.passwordInput).fill(userObject.password);
    await page.locator(gmail.loginView.passwordNextBtn).click();

    const selector = selectorAwaited === undefined ? gmail.composeBtn : selectorAwaited;
    const { recoveryEmailItem } = gmail.verifyView;
    const { notNowBtn } = gmail.verifyView;
    await page.waitForSelector(`:is(${selector}, ${recoveryEmailItem}, ${notNowBtn})`, { timeout: 60000 });
    if (await page.isVisible(recoveryEmailItem)) {
        await page.locator(recoveryEmailItem).click();
        await page.locator(gmail.verifyView.recoveryEmailInput).fill(userObject.recoveryEmail);
        await page.locator(gmail.verifyView.nextBtn).click();
        await page.locator(selector).waitFor({ state: 'visible', timeout: 60000 });
    }
    if (await page.isVisible(notNowBtn)) await page.locator(notNowBtn).click();

    await page.goto('/');

    await page.waitForSelector(selectors.firstScreen.unsupportedModal.continueAnywayBtn);
    await page.locator(selectors.firstScreen.unsupportedModal.continueAnywayBtn).click();

    await page.locator(selectors.loginButton).click();
    await page.locator(selectors.loginGoogleButton).click();

    await page.waitForURL('https://local.virtru.com/');
    await page.waitForSelector(selectors.logoutButton);
}

type EncryptDecryptProcedure = {
    page: Page,
    recipientEmail?: string,
    full?: boolean
}

export const encryptDecryptProcedure = async (props: EncryptDecryptProcedure) => {
    const { page, recipientEmail, full } = props;
    await page.locator(selectors.draggableItem).dragTo(page.locator(selectors.dropZone));

    if (recipientEmail) {
        await page.fill('input[type=email]', recipientEmail);
        await page.getByText(selectors.grantBtnText).click();
        await expect(page.getByText(selectors.revokeBtnText)).toBeVisible();
    }

    await page.getByText(selectors.protectFileBtnText).click();

    if (full) {
        const responsePublicKey = await page.waitForResponse('**/auth/oidc/public-key');
        await expect(responsePublicKey.status() === 200).toBeTruthy();

        const responseToken = await page.waitForResponse('**/oauth2/default/v1/token');
        await expect(responseToken.status() === 200).toBeTruthy();

        const responseEntityObject = await page.waitForResponse('**/accounts/api/entityobject');
        await expect(responseEntityObject.status() === 200).toBeTruthy();

        const responseUserSettings = await page.waitForResponse('**/accounts/api/userSettings');
        await expect(responseUserSettings.status() === 200).toBeTruthy();

        const responseUpsert = await page.waitForResponse('**/kas/upsert');
        await expect(responseUpsert.status() === 200).toBeTruthy();
        await page.getByText(selectors.downloadFileBtnText).click();

        const downloadPromise = page.waitForEvent('download');
        await page.getByText(selectors.decryptAndDownloadBtnText).click();
        // Start waiting for download before clicking. Note no await.
        const download = await downloadPromise;
        const fileName = download.suggestedFilename();
        // Wait for the download process to complete
        // console.log(await download.path());
        // Save downloaded file somewhere
        await download.saveAs(fileName);
        const fileContent = await fs.readFile(fileName);
        expect(fileContent.toString() === 'Hello world!').toBeTruthy();
        await fs.rm(fileName);
    }
};


