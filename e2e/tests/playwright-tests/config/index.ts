// @ts-ignore
import accounts from '../../../../accounts.json';

export const userAuthData = {
	mainUser: { // .auth-cks/user.json | Z|X
		login: 'testerfour@trusteddataformat.org',
		password: accounts['testerfour@trusteddataformat.org'].password,
		email: 'cc_adminuser1@trusteddataformat.org',
	},
	secondUser: { // .auth-cks/user3.json |Y
		login: 'test-user1@trusteddataformat.org',
		password: accounts['test-user1@trusteddataformat.org'].password,
		email: 'testerfour@trusteddataformat.org',
	},
	nonCKS: {
		user1: { // .auth-non-cks/user1.json | user W
			login: 'shareautomation01@gmail.com',
			password: accounts['shareautomation01@gmail.com'].password,
			email: 'testerfour@trusteddataformat.org'
		},
		user2: { // .auth-non-cks/user2.json | user Y
			login: 'virtruqa3@gmail.com',
			password: accounts['virtruqa3@gmail.com'].password,
			email: 'testerfour@trusteddataformat.org'
		},
	}
};