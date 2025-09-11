import { Client } from '@microsoft/microsoft-graph-client';
import type { DriveItem, User } from '@microsoft/microsoft-graph-types';
import { getAuthService } from '../auth/authService.svelte';

class GraphService {
	private graphClient: Client | null = null;

	private async getGraphClient(): Promise<Client> {
		if (!this.graphClient) {
			const auth = getAuthService();
			const accessToken = await auth.acquireTokenSilent();
			if (!accessToken) {
				throw new Error('No access token available');
			}

			this.graphClient = Client.init({
				authProvider: async (done) => {
					done(null, accessToken);
				}
			});
		}
		return this.graphClient;
	}

	async getUserProfile(): Promise<User> {
		await this.getGraphClient(); // Ensure client is initialized
		return await this.graphClient!.api('/me').get();
	}

	async getFiles(path: string = '/me/drive/root/children'): Promise<DriveItem[]> {
		await this.getGraphClient(); // Ensure client is initialized
		const response = await this.graphClient!.api(path).get();
		return response.value || [];
	}

	async getFileContent(itemId: string): Promise<ArrayBuffer> {
		await this.getGraphClient(); // Ensure client is initialized
		return await this.graphClient!.api(`/me/drive/items/${itemId}/content`).get();
	}

	async downloadFile(itemId: string): Promise<Blob> {
		const content = await this.getFileContent(itemId);
		return new Blob([content]);
	}

	async searchFiles(query: string): Promise<DriveItem[]> {
		await this.getGraphClient(); // Ensure client is initialized
		const response = await this.graphClient!.api(`/me/drive/root/search(q='${query}')`).get();
		return response.value || [];
	}

	async getFolderContents(folderId: string): Promise<DriveItem[]> {
		await this.getGraphClient(); // Ensure client is initialized
		const response = await this.graphClient!.api(`/me/drive/items/${folderId}/children`).get();
		return response.value || [];
	}

	async getUserThumbnail(userId?: string): Promise<string | null> {
		try {
			await this.getGraphClient(); // Ensure client is initialized
			
			// If no userId is provided, use the current user
			const path = userId ? `/users/${userId}/photos/120x120/$value` : '/me/photos/120x120/$value';
			
			// Get the response as an ArrayBuffer and convert to Blob
			const response = await this.graphClient!.api(path).get();
			
			const blob = new Blob([response]);
			
			// Convert blob to data URL
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
		} catch (error) {
			console.log('Failed to fetch user thumbnail:', error);
			return null;
		}
	}

	// Reset client when token changes
	resetClient() {
		this.graphClient = null;
	}
}

export const graphService = new GraphService();
