export const selectors = {
    sectionTab: '.nav-link',
    loginButton: '.headerAuth > button:nth-child(1)',
    loginGoogleButton: '.oauthButtons > button:nth-child(1)',
    logoutButton: '.currentUser button',
    loginScreen: {
        usernameField: '#identifierId',
        nextFirstBtn: '#identifierNext > div > button > span',
        passwordField: '#password input',
        passwordNextBtn: '#passwordNext',
        submitButton: '#kc-login'
    },
    firstScreen: {
        unsupportedModal: {
            selector: '.unsupportedWrapper h3',
            text: 'Please view this demo on a desktop computer or tablet in Chrome.',
            continueAnywayBtn: '.unsupportedWrapper button',
        }
    },
    draggableItem: '[draggable="true"]',
    dropZone: '#dropzone',
    uploadInput: '#upload',
    grantBtnText: 'Grant',
    revokeBtnText: 'Revoke',
    protectFileBtnText : 'Protect File',
    downloadFileBtnText: 'Download',
    downloadTDFFileBtnText: 'Download TDF',
    decryptAndDownloadBtnText : 'Decrypt and Download',
    // rest
    secondaryHeader: 'h2',
    realmSelector: '#rc_select_0',
    attributesPage: {
        attributesHeader: {
            authorityDropdownButton: "#select-authorities-button",
            itemsQuantityIndicator: '.ant-pagination-total-text',
            sortByToolbarButton: "#sort-by-button",
            filtersToolbarButton: "#filters-button",
            filterModal: {
                ruleInputField: '#filter_rule',
                nameInputField: '#filter_name',
                orderInputField: '#filter_order',
                submitBtn: '#submit-filter-button',
                clearBtn: '#clear-filter-button'
            },
        },
        attributeDetailsSection: {
            editRuleButton: '#edit',
            deleteAttributeButton: '#delete-attribute',
            confirmAttributeDeletionModal: {
                cancelDeletionBtn: '#cancel-attribute-deletion',
                confirmDeletionBtn: '#confirm-attribute-deletion',
            },
            closeDetailsSectionButton: "#close-details-button",
            ruleDropdown: '.attribute-rule__select',
            saveRuleButton: '#save-rule',
            cancelRuleSavingButton: '#cancel',
        },
        newSectionBtn: '.ant-collapse-header',
        newSection: {
            authorityField: '#authority',
            submitAuthorityBtn: '#authority-submit',
            attributeNameField: "#name",
            ruleField: '[data-test-id=rule-form-item]',
            ruleOptions: {
                hierarchical: '',
                permissive:'',
                restrictive: '',
            },
            orderField1: '#order_0',
            plusOrderButton: '#plus-order-button',
            minusOrderButton: '#minus-order-button',
            submitAttributeBtn: '#create-attribute-button',
        },
        attributeItem: '.ant-list-item',
    },
    entitlementsPage: {
        authorityNamespaceField:'#authority',
        attributeNameField: '#name',
        attributeValueField: '#value',
        submitAttributeButton: "#assign-submit",
        entityDetailsPage: {
            tableCell: '.ant-table-cell',
            tableRow: '.ant-table-row',
            deleteEntitlementBtn: '.ant-btn-link >> nth=0',
            deleteEntitlementModalBtn: '#delete-attr',
        }
    },
    authoritiesPage: {
        header: '.ant-page-header-heading-title',
        authoritiesTableRow: '.ant-table-row',
        deleteAuthorityButton: '#delete-authority-button',
        confirmDeletionModal: {
            cancelDeletionBtn: '#cancel-deletion',
            confirmDeletionBtn: '#delete-authority',
        }
    },
    alertMessage: '.Toastify__toast-body',
    tokenMessage: '.Toastify__toast'
}
