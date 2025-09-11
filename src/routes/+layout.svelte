<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { setTheme } from '@fluentui/web-components';
	import { webLightTheme } from '@fluentui/tokens';
	import { setAuthService } from '$lib/auth/authService.svelte';
  
	let { children } = $props();
	setTheme(webLightTheme);

  setAuthService();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script type="module" src="https://unpkg.com/@fluentui/web-components@beta"></script>
</svelte:head>

{@render children?.()}
