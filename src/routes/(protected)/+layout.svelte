<script lang="ts">
	import { getAuthService } from '$lib/auth/authService.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { TopBar } from '$lib/components';

	const auth = getAuthService();
	let { children } = $props();
	let isInitializing = $state(true);

	$effect(() => {
		if (auth.isAuthenticated) {
			isInitializing = false;
		}
	});
</script>

{#if auth.isAuthenticated && !isInitializing}
	<div class="container">
		<TopBar />

		<main class="main">
			{@render children?.()}
		</main>

		<footer class="footer">
			<fluent-button>Default</fluent-button>
			<fluent-button appearance="primary">Primary</fluent-button>
			<fluent-button appearance="outline">Outline</fluent-button>
			<fluent-button appearance="subtle">Subtle</fluent-button>
			<fluent-button appearance="transparent">Transparent</fluent-button>
		</footer>
	</div>
{:else if isInitializing}
	<div class="auth-loading">
		<div class="loading-content">
			<div class="spinner"></div>
			<p>Initializing...</p>
		</div>
	</div>
{:else}
	<div class="auth-loading">
		<div class="loading-content">
			<div class="spinner"></div>
			<p>Redirecting to login...</p>
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.main {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		background: var(--neutral-layer-1, #fafafa);
	}

	.footer {
		flex-shrink: 0;
		padding: 1rem;
		background: var(--neutral-layer-2, #f5f5f5);
		border-top: 1px solid var(--neutral-stroke-2, #e0e0e0);
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.auth-loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: var(--neutral-layer-1, #fafafa);
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: var(--neutral-foreground-2, #616161);
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid var(--neutral-stroke-2, #e0e0e0);
		border-top: 2px solid var(--accent-fill-rest, #0078d4);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-content p {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 400;
	}
</style>
