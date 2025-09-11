<script lang="ts">
	import { getAuthService } from '../auth/authService.svelte';
  import SignOutRegular from 'fluentui-icons-svelte/SignOutRegular.svelte';

  const auth = getAuthService();

	let { class: className = '' } = $props();

	let isLoading = $state(false);
	let user = $derived(auth.user);
	let userThumbnail = $derived(auth.userThumbnail);

	const handleLogin = async () => {
		isLoading = true;
		try {
			await auth.login();
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			isLoading = false;
		}
	};

	const handleLogout = async () => {
		isLoading = true;
		try {
			await auth.logout();
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="auth-container {className}">
	{#if auth.isAuthenticated && user}
		<fluent-button
			appearance="subtle"
			onclick={handleLogout}
			disabled={isLoading ? 'true' : undefined}
			role="button"
			tabindex={0}
			onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleLogout()}
		>
			<span slot="start">
				<fluent-avatar name={user?.name || user?.username} alt="User avatar">
          {#if userThumbnail}
            <img src={userThumbnail} alt="User avatar" />
          {/if}
        </fluent-avatar>
			</span>
			<span class="welcome">{isLoading ? 'Signing out...' : (user?.name || user?.username)}</span>
			<span slot="end" style='margin-top: 8px;'><SignOutRegular /></span>
		</fluent-button>
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<fluent-button
			appearance="accent"
			onclick={handleLogin}
			disabled={isLoading ? 'true' : undefined}
		>
			{isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
		</fluent-button>
	{/if}
</div>

<style>
	.auth-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.welcome {
		font-weight: 500;
		color: var(--neutral-foreground-rest);
	}

	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 8px;
	}

	.user-avatar-placeholder {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--colorBrandBackground);
		color: var(--colorNeutralForegroundOnBrand);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 14px;
		margin-right: 8px;
	}
</style>
