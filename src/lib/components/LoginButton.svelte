<script lang="ts">
	import { getAuthService } from '../auth/authService.svelte';
	import SignOutRegular from 'fluentui-icons-svelte/SignOutRegular.svelte';
	import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
	import Text from './Text.svelte';

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
		<div style="position: relative; display: inline-block;">
			<fluent-menu>
				<fluent-menu-button slot="trigger" appearance="subtle" disabled={isLoading ? 'true' : undefined}>
					<span slot="start">
						<fluent-avatar name={user?.name || user?.username} alt="User avatar">
							{#if userThumbnail}
								<img src={userThumbnail} alt="User avatar" />
							{/if}
						</fluent-avatar>
					</span>
					<span class="welcome">
						<Text
							key={isLoading ? 'Loading' : 'authLoggedin'}
							params={{ name: user?.name || user?.username }}
						/>
					</span>
					<span slot="end">
						<ChevronDownRegular />
					</span>
				</fluent-menu-button>

				<fluent-menu-list>
					<fluent-menu-item disabled style="min-height: 3rem">
            <div class="user-name">{user?.name || user?.username}</div>
            <div class="user-email">{user?.username}</div>
          </fluent-menu-item>
					<fluent-divider></fluent-divider>
					<fluent-menu-item
						role="menuitem"
						tabindex="0"
						onclick={handleLogout}
						onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleLogout()}
						disabled={isLoading}
					>
						<span slot="start">
							<SignOutRegular />
						</span>
						<Text key="authSignout" />
					</fluent-menu-item>
				</fluent-menu-list>
			</fluent-menu>
		</div>
	{:else}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<fluent-button
			id="login-button"
			appearance="accent"
			onclick={handleLogin}
			disabled={isLoading ? 'true' : undefined}
		>
			<Text key={isLoading ? 'Loading' : 'authSignin'}></Text>
		</fluent-button>
		<fluent-tooltip anchor="login-button" positioning="below-end">
			<Text key="authSignin" />
		</fluent-tooltip>
	{/if}
</div>

<style>
	.auth-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.welcome {
		font-weight: 500;
		color: var(--neutral-foreground-rest);
	}

	.user-menu-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.chevron {
		transition: transform 0.2s ease;
		display: flex;
		align-items: center;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.user-details {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px 0;
		min-width: 200px;
		line-height: 1.2;
	}

	.user-name {
		font-weight: 600;
		color: var(--neutral-foreground-1, #242424);
		font-size: 14px;
	}

	.user-email {
		font-size: 12px;
		color: var(--neutral-foreground-2, #616161);
	}
</style>
