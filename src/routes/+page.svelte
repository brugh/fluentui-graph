<script lang="ts">
	import LoginButton from '$lib/components/LoginButton.svelte';
	import FileBrowser from '$lib/components/FileBrowser.svelte';
</script>

<div class="container">
	<header class="header">
		<fluent-text size="800">Microsoft Graph File Explorer</fluent-text>
		<LoginButton />
	</header>

	<main class="main">
		<FileBrowser />
	</main>

	<footer class="footer">
		<fluent-button>Default</fluent-button>
		<fluent-button appearance="primary">Primary</fluent-button>
		<fluent-button appearance="outline">Outline</fluent-button>
		<fluent-button appearance="subtle">Subtle</fluent-button>
		<fluent-button appearance="transparent">Transparent</fluent-button>
	</footer>
</div>

<style>
	.container {
		min-height: 100vh;
    max-width: 960px;
    margin-inline: auto;
		display: flex;
		flex-direction: column;
		height: 100vh; /* Set explicit height to fill viewport */
		overflow: hidden; /* Prevent scrolling on the container */
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		flex-shrink: 0; /* Prevent header from shrinking */
	}

	.main {
		flex: 1; /* Fill remaining space */
		overflow: auto; /* Add scrolling to main content if needed */
		padding: 1rem;
	}

	.footer {
		padding: 1rem;
		flex-shrink: 0; /* Prevent footer from shrinking */
	}

</style>
