<script lang="ts">
	export let errors: Record<string, string> = {};
	export let entryMode = 'url';
	export let content = '';
	export let isUrlValid = false;
	export let validOnce = false;

	async function handleContentInput(event: Event) {
		errors.content = '';

		if (entryMode === 'url') {
			const { validateUrl } = await import('$lib/utilities');
			isUrlValid = await validateUrl(content);
			if (isUrlValid) {
				validOnce = true;
			}
		} else if (event && event.target) {
			(event.target as HTMLInputElement).style.height = 'auto';
			(event.target as HTMLInputElement).style.height =
				(event.target as HTMLInputElement).scrollHeight + 'px';
		}
	}
</script>

{#if entryMode === 'url'}
	<label class="label">
		<span>Paste a long URL</span>
		<input
			class="input w-full h-12 {errors.content ? 'input-error' : ''}"
			type="url"
			multiple={false}
			name="content"
			title="Content"
			aria-label="URL"
			placeholder="https://example.com/long-url"
			on:input={handleContentInput}
			bind:value={content}
			spellcheck="false"
		/>
		{#if errors.content}
			<div class="ml-2 text-error-500">{errors.content}</div>
		{/if}
	</label>
{:else}
	<label class="label">
		<span class="text-lg">Paste your plain text</span>
		<textarea
			class="textarea {errors.content ? 'input-error' : ''}"
			rows="16"
			placeholder="It better be good!"
			name="content"
			aria-label="Enter your plain text here..."
			bind:value={content}
			on:input={handleContentInput}
			spellcheck="false"
			title="Content"
		></textarea>
		{#if errors.content}
			<div class="ml-2 text-error-500">{errors.content}</div>
		{/if}
	</label>
{/if}
