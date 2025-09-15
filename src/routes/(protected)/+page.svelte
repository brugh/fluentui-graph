<script lang="ts">
	import FileBrowser from '$lib/components/FileBrowser.svelte';
	import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';
</script>

<div class="main-header">
	<fluent-text size="800">Microsoft Graph File Explorer</fluent-text>
	<LanguageSwitch />
</div>
<FileBrowser />
