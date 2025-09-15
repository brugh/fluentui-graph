<script lang="ts">
	import { getAuthService } from '$lib/auth/authService.svelte';
	import { goto } from '$app/navigation';
	import Text from '$lib/components/Text.svelte';

	const auth = getAuthService();

	let isLoading = $state(false);

	const handleLogin = async () => {
		isLoading = true;
		try {
			await auth.login();
			// Redirect to home page after successful login
			goto('/');
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			isLoading = false;
		}
	};

	// If already authenticated, redirect to home
	$effect(() => {
		if (auth.isAuthenticated) {
			goto('/');
		}
	});
</script>

<div class="login-container">
	<div class="login-card">
		<h1><Text key="authSignin" /></h1>
		<p>Please sign in to access the application.</p>

		<fluent-button
			appearance="accent"
			role="button"
			tabindex="0"
			onclick={handleLogin}
			onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleLogin()}
			disabled={isLoading ? 'true' : undefined}
		>
			<Text key={isLoading ? 'Loading' : 'authSignin'} />
		</fluent-button>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		background: var(--neutral-layer-1);
	}

	.login-card {
		background: var(--neutral-layer-2);
		padding: 3rem;
		border-radius: 8px;
		box-shadow: var(--elevation-shadow-card-rest);
		text-align: center;
		max-width: 400px;
		width: 100%;
	}

	h1 {
		margin-bottom: 1rem;
		color: var(--neutral-foreground-rest);
	}

	p {
		margin-bottom: 2rem;
		color: var(--neutral-foreground-hint);
	}

	fluent-button {
		width: 100%;
	}
</style>
