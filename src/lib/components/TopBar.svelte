<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoginButton from './LoginButton.svelte';
	import Text from './Text.svelte';
	import NavigationRegular from 'fluentui-icons-svelte/NavigationRegular.svelte';

	const handleNavigation = () => {
		if ($page.url.pathname === '/setup') {
			goto('/');
		} else {
			goto('/setup');
		}
	};
</script>

<header class="topbar">
	<div class="topbar-left">
		<fluent-button
			appearance="subtle"
			role="button"
			tabindex="0"
			onclick={handleNavigation}
			onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleNavigation()}
			aria-label="Navigate to setup"
			class="hamburger-button"
		>
			<NavigationRegular />
		</fluent-button>
		<fluent-text size="600" class="app-title">
			<Text key="appTitle" />
		</fluent-text>
	</div>

	<div class="topbar-right">
		<LoginButton />
	</div>
</header>

<style>
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 24px;
		background: var(--neutral-layer-1, #ffffff);
		border-bottom: 1px solid var(--neutral-stroke-2, #e0e0e0);
		min-height: 56px;
		box-sizing: border-box;
	}

	.topbar-left {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.topbar-right {
		display: flex;
		align-items: center;
	}

	.hamburger-button {
		padding: 8px;
    min-width: 2rem;
		border-radius: var(--corner-radius-medium, 8px);
	}

	.app-title {
		font-weight: 600;
		color: var(--neutral-foreground-1, #242424);
	}

	@media (max-width: 768px) {
		.topbar {
			padding: 8px 16px;
		}

		.topbar-left {
			gap: 12px;
		}

		.app-title {
			font-size: 14px;
		}
	}
</style>
