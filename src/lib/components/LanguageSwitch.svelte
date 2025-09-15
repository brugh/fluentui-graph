<script lang="ts">
	import {getLocale } from '$lib/paraglide/runtime';
	import type { AvailableLanguageTags } from '$lib/models';
	import { getState } from '$lib/state.svelte';

  const state = getState();
  const currentLanguage = $derived(getLocale() as AvailableLanguageTags);

  const languages = [
		{ 
			code: 'en' as AvailableLanguageTags, 
			name: 'English', 
			flagClass: 'gb',
			flagImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMDAyNDdkIi8+PHBhdGggZD0iTTAsNjAwIEw2MDAsNjAwIEwxMjAwLDAgTDEyMDAsNjAwIFoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCwwIEw2MDAsNjAwIEwxMjAwLDAgWiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wLDAgTDEyMDAsNjAwIE0xMjAwLDAgTDAsNjAwIiBzdHJva2U9IiNjZjE0MmIiIHN0cm9rZS13aWR0aD0iMTIwIi8+PHBhdGggZD0iTTYwMCwwIEw2MDAsNjAwIE0wLDMwMCBMMTIwMCwzMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyMDAiLz48cGF0aCBkPSJNNjAwLDAgTDYwMCw2MDAgTTAsMzAwIEwxMjAwLDMwMCIgc3Ryb2tlPSIjY2YxNDJiIiBzdHJva2Utd2lkdGg9IjEyMCIvPjwvc3ZnPg=='
		},
		{ 
			code: 'nl' as AvailableLanguageTags, 
			name: 'Nederlands', 
			flagClass: 'nl',
			flagImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj48cmVjdCBmaWxsPSIjMjE0NjhiIiB3aWR0aD0iOTAwIiBoZWlnaHQ9IjYwMCIvPjxyZWN0IGZpbGw9IiNmZmYiIHdpZHRoPSI5MDAiIGhlaWdodD0iNDAwIi8+PHJlY3QgZmlsbD0iI2FlMTMyOSIgd2lkdGg9IjkwMCIgaGVpZ2h0PSIyMDAiLz48L3N2Zz4='
		}
	];

	let dropdown: HTMLElement;

	function handleLanguageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newLanguage = target.value as AvailableLanguageTags;
		state.setLanguage(newLanguage);
	}
</script>

<fluent-text>
	<fluent-dropdown
		id="language-dropdown"
		bind:this={dropdown}
		onchange={handleLanguageChange}
	>
		<fluent-listbox>
			{#each languages as language}
				<fluent-option value={language.code} selected={currentLanguage === language.code}>
					<span class="flag" style="background-image: url('{language.flagImage}')"></span> {language.name}
				</fluent-option>
			{/each}
		</fluent-listbox>
	</fluent-dropdown>
</fluent-text>

<style>
	fluent-text {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.flag {
		display: inline-block;
		width: 1.5rem;
		height: 1rem;
		margin-right: 0.5rem;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		vertical-align: middle;
	}


	:global(fluent-dropdown::part(control)) {
		min-width: 3rem;
		padding: 0.25rem 0.5rem;
	}

	:global(fluent-dropdown::part(listbox)) {
		min-width: 8rem;
	}
</style>
