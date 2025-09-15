<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		key: string;
		params?: Record<string, any>;
	}

	const { key, params }: Props = $props();

	// Get the translation function and call it with parameters
	const translatedText = $derived.by(() => {
		const translationFn = (m as any)[key];
		if (typeof translationFn === 'function') {
			try {
				return params ? translationFn(params) : translationFn();
			} catch (error) {
				// If function call fails, return the key as fallback
				return key;
			}
		}
		return key; // Fallback to key if translation not found
	});
</script>

<fluent-text>
	{translatedText}
</fluent-text>
