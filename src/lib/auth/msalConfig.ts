import { type Configuration, LogLevel } from '@azure/msal-browser';
import { env } from '$env/dynamic/public';
import { page } from '$app/state';

export const msalConfig: Configuration = {
	auth: {
		clientId: env.PUBLIC_AZURE_CLIENT_ID,
		authority: 'https://login.microsoftonline.com/common',
		redirectUri: window.location.origin,
		postLogoutRedirectUri: window.location.origin
	},
	cache: {
		cacheLocation: 'sessionStorage',
		storeAuthStateInCookie: false
	},
	system: {
		loggerOptions: {
			loggerCallback: (level, message, containsPii) => {
				if (containsPii) return;
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
				}
			}
		}
	}
};

export const loginRequest = {
	scopes: ['User.Read', 'Files.Read', 'Files.ReadWrite']
};

export const graphConfig = {
	graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
	graphFilesEndpoint: 'https://graph.microsoft.com/v1.0/me/drive/root/children'
};
