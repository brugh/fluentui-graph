<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuthService } from '../auth/authService.svelte';
	import { graphService } from '../graph/graphService.svelte';
	import type { DriveItem } from '@microsoft/microsoft-graph-types';

  const auth = getAuthService();

	let files = $state<DriveItem[]>([]);
	let currentPath = $state<string>('root');
	let breadcrumbs = $state<Array<{id: string, name: string}>>([{id: 'root', name: 'OneDrive'}]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let searchQuery = $state('');

	onMount(() => {
		if (auth.isAuthenticated) {
			loadFiles();
		}
	});

	const loadFiles = async (path?: string) => {
		if (!auth.isAuthenticated) return;
		
		isLoading = true;
		error = null;
		
		try {
			if (path && path !== 'root') {
				files = await graphService.getFolderContents(path);
			} else {
				files = await graphService.getFiles();
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load files';
			console.error('Error loading files:', err);
		} finally {
			isLoading = false;
		}
	};

	const handleFolderClick = async (item: DriveItem) => {
		if (item.folder && item.id && item.name) {
			currentPath = item.id;
			breadcrumbs = [...breadcrumbs, {id: item.id, name: item.name}];
			await loadFiles(item.id);
		}
	};

	const handleFileDownload = async (item: DriveItem) => {
		if (!item.id) return;
		
		try {
			const blob = await graphService.downloadFile(item.id);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = item.name || 'download';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Download failed:', err);
		}
	};

	const handleSearch = async () => {
		if (!searchQuery.trim() || !auth.isAuthenticated) return;
		
		isLoading = true;
		error = null;
		
		try {
			files = await graphService.searchFiles(searchQuery);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Search failed';
		} finally {
			isLoading = false;
		}
	};

	const goToRoot = () => {
		currentPath = 'root';
		breadcrumbs = [{id: 'root', name: 'OneDrive'}];
		loadFiles();
	};

	const navigateToBreadcrumb = (index: number) => {
		const targetBreadcrumb = breadcrumbs[index];
		currentPath = targetBreadcrumb.id;
		breadcrumbs = breadcrumbs.slice(0, index + 1);
		loadFiles(targetBreadcrumb.id === 'root' ? undefined : targetBreadcrumb.id);
	};

	const formatFileSize = (size?: number) => {
		if (!size) return '';
		const units = ['B', 'KB', 'MB', 'GB'];
		let unitIndex = 0;
		let fileSize = size;
		
		while (fileSize >= 1024 && unitIndex < units.length - 1) {
			fileSize /= 1024;
			unitIndex++;
		}
		
		return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString();
	};
</script>

{#if auth.isAuthenticated}
	<div class="file-browser">
		<div class="toolbar">
			<div class="navigation">
				<div class="breadcrumbs">
					{#each breadcrumbs as crumb, index (crumb.id)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<fluent-button 
							appearance="subtle" 
							onclick={() => navigateToBreadcrumb(index)}
							role="button" 
							tabindex={0} 
							onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && navigateToBreadcrumb(index)}
						>
							{index === 0 ? '📁' : ''} {crumb.name}
						</fluent-button>
						{#if index < breadcrumbs.length - 1}
							<span class="path-separator">></span>
						{/if}
					{/each}
				</div>
			</div>
			
			<div class="search-container">
				<fluent-text-field tabindex={0}
					value={searchQuery}
					placeholder="Search files..."
					oninput={(e: any) => searchQuery = e.target.value}
					onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleSearch()}
					role="textbox"
					aria-multiline={false}
				></fluent-text-field>
			</div>
		</div>

		{#if isLoading}
			<div class="loading">
				<fluent-progress-ring></fluent-progress-ring>
				<span>Loading files...</span>
			</div>
		{:else if error}
			<div class="error">
				<span>❌ {error}</span>
				<fluent-button onclick={() => loadFiles()} role="button" tabindex={0} onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && loadFiles()}>Retry</fluent-button>
			</div>
		{:else if files.length === 0}
			<div class="empty">
				<span>📂 No files found</span>
			</div>
		{:else}
			<div class="file-list">
				{#each files as item (item.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<fluent-compound-button
						class="file-item-button"
						onclick={() => item.folder ? handleFolderClick(item) : handleFileDownload(item)}
					>
						<span slot="start" class="file-icon">
							{item.folder ? '📁' : '📄'}
						</span>
						<div class="file-content">
							<div class="file-name">{item.name}</div>
							<div class="file-meta">
								{#if item.size}
									{formatFileSize(item.size)} • 
								{/if}
								{formatDate(item.lastModifiedDateTime)}
							</div>
						</div>
					</fluent-compound-button>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="auth-required">
		<p>Please sign in to access your OneDrive files.</p>
	</div>
{/if}

<style>
	.file-browser {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

  .file-item-button {
    padding: 0.25rem;
    margin:0;
  }

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.navigation {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;
	}

	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	.path-separator {
		color: var(--neutral-foreground-rest);
		margin: 0 0.25rem;
		font-size: 0.875rem;
	}

	.search-container {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.loading, .error, .empty {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
	}

	.error {
		color: var(--error-foreground-rest);
	}

	.file-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	:global(.file-item-button) {
		width: 100%;
		text-align: left;
		justify-content: flex-start;
	}

	.file-icon {
		font-size: 1.5rem;
	}

	.file-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
		margin-left: 0.75rem;
	}

	.file-name {
		font-weight: 500;
		color: var(--neutral-foreground-rest);
	}

	.file-meta {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}

	.auth-required {
		text-align: center;
		padding: 2rem;
		color: var(--neutral-foreground-rest);
	}

	@media (max-width: 600px) {
		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.search-container {
			width: 100%;
		}

		.file-content {
			margin-left: 0.5rem;
		}

	}
</style>
