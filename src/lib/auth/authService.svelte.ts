import { PublicClientApplication, type AccountInfo, type AuthenticationResult } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './msalConfig';
import { getContext, setContext } from 'svelte';
import { graphService } from '../graph/graphService.svelte';

class AuthService {
	private msalInstance: PublicClientApplication;
	public isAuthenticated = $state(false);
	public user = $state<AccountInfo | null>(null);
	public userThumbnail = $state<string | null>(null);
	public accessToken = $state<string | null>(null);

	constructor() {
		this.msalInstance = new PublicClientApplication(msalConfig);
		this.initialize();
	}

	async initialize() {
		await this.msalInstance.initialize();
		
		// Check if user is already logged in
		const accounts = this.msalInstance.getAllAccounts();
		if (accounts.length > 0) {
			this.user = accounts[0];
			this.isAuthenticated = true;
			await this.acquireTokenSilent();
			await this.fetchUserThumbnail();
		}
	}

	async login() {
		try {
			const response = await this.msalInstance.loginPopup(loginRequest);
			this.handleAuthResponse(response);
			return response;
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	}

	async logout() {
		try {
			await this.msalInstance.logoutPopup();
			this.user = null;
			this.userThumbnail = null;
			this.isAuthenticated = false;
			this.accessToken = null;
		} catch (error) {
			console.error('Logout failed:', error);
			throw error;
		}
	}

	async fetchUserThumbnail() {
		if (!this.accessToken || !this.user) return;

		try {
			// Use user ID-based photo URL with Graph API
			const userId = this.user.localAccountId || this.user.homeAccountId?.split('.')[0];
			if (userId) {
				// Use graphService to fetch the user thumbnail
				const thumbnail = await graphService.getUserThumbnail(userId);
				if (thumbnail) {
					this.userThumbnail = thumbnail;
					console.log('User thumbnail loaded via graphService');
				}
			}
		} catch (error) {
			console.log('Failed to fetch user thumbnail:', error);
			// Silently fail - thumbnail is optional
		}
	}

	async acquireTokenSilent() {
		const accounts = this.msalInstance.getAllAccounts();
		if (accounts.length === 0) return null;

		try {
			const response = await this.msalInstance.acquireTokenSilent({
				...loginRequest,
				account: accounts[0]
			});
			this.accessToken = response.accessToken;
			return response.accessToken;
		} catch (error) {
			console.error('Silent token acquisition failed:', error);
			// Fallback to interactive login
			return await this.acquireTokenInteractive();
		}
	}

	async acquireTokenInteractive() {
		try {
			const response = await this.msalInstance.acquireTokenPopup(loginRequest);
			this.accessToken = response.accessToken;
			return response.accessToken;
		} catch (error) {
			console.error('Interactive token acquisition failed:', error);
			throw error;
		}
	}

	private handleAuthResponse(response: AuthenticationResult) {
		if (response.account) {
			this.user = response.account;
			this.isAuthenticated = true;
			this.accessToken = response.accessToken;
			this.fetchUserThumbnail();
		}
	}

	getAccount(): AccountInfo | null {
		const accounts = this.msalInstance.getAllAccounts();
		return accounts.length > 0 ? accounts[0] : null;
	}
}

const AUTH = Symbol('authService');
let authServiceInstance: AuthService | null = null;

export const setAuthService = () => {
	if (!authServiceInstance) {
		authServiceInstance = new AuthService();
	}
	setContext<AuthService>(AUTH, authServiceInstance);
	return authServiceInstance;
};

export const getAuthService = () => {
	if (authServiceInstance) {
		return authServiceInstance;
	}
	return getContext<AuthService>(AUTH);
};