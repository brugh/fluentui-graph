<script lang="ts">
	let dialog: any;
</script>

<div class="flex">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<fluent-button onclick={() => dialog?.show()}>Open Dialog</fluent-button>
	<fluent-dialog bind:this={dialog}>
    <fluent-dialog-body>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<fluent-button slot="action" appearance="primary" onclick={() => dialog?.hide()}>
				Close Dialog
			</fluent-button>

			<p>
				The dialog component is a window overlaid on either the primary window or another dialog
				window. Windows under a modal dialog are inert.
			</p>
			<p>That is, users cannot interact with content outside an active dialog window.</p>

			<div slot="title">Default Dialog</div>
		</fluent-dialog-body>
	</fluent-dialog>

	<fluent-accordion expand-mode="single">
		<fluent-accordion-item>
			<span slot="heading">Accordion Header 1</span>
			Accordion Panel 1
		</fluent-accordion-item>

		<fluent-accordion-item>
			<span slot="heading">Accordion Header 2</span>
			Accordion Panel 2
		</fluent-accordion-item>

		<fluent-accordion-item>
			<span slot="heading">Accordion Header 3</span>
			Accordion Panel 3
		</fluent-accordion-item>
	</fluent-accordion>

	<fluent-field label-position="after">
		<fluent-checkbox slot="input"></fluent-checkbox>

		<label slot="label" for="checkbox">Label goes here</label>
	</fluent-field>

	<fluent-field>
		<label slot="label" for="radio-group">Favorite Fruit</label>
		<fluent-radio-group
			slot="input"
			id="radio-group"
			aria-labelledby="radio-group--label"
			orientation="vertical"
			name="favorite-fruit"
		>
			<fluent-field label-position="after">
				<label slot="label" for="radio-group--apple">Apple</label>
				<fluent-radio slot="input" id="radio-group--apple" name="favorite-fruit" value="apple"
				></fluent-radio>
			</fluent-field>

			<fluent-field label-position="after">
				<label slot="label" for="radio-group--banana">Banana</label>
				<fluent-radio slot="input" id="radio-group--banana" name="favorite-fruit" value="banana"
				></fluent-radio>
			</fluent-field>
		</fluent-radio-group>
	</fluent-field>

	<div class="buttons">
		<fluent-button>Default</fluent-button>
		<fluent-button appearance="primary">Primary</fluent-button>
		<fluent-button appearance="outline">Outline</fluent-button>
		<fluent-button appearance="subtle">Subtle</fluent-button>
		<fluent-button appearance="transparent">Transparent</fluent-button>
	</div>
</div>

<style>
	.buttons {
		max-width: 200px;
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}

	.flex {
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}
</style>
