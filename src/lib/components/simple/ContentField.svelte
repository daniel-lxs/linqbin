<script lang="ts">
	export let errors: Record<string, string> = {};
	export let entryMode = 'url';
	export let content = '';
	export let isUrlValid = false;
	export let validOnce = false;

	async function handleContentInput() {
		errors.content = '';

		if (entryMode === 'url') {
			const { validateUrl } = await import('$lib/utilities');
			isUrlValid = await validateUrl(content);
			if (isUrlValid) {
				validOnce = true;
			}
		}
	}
</script>

{#if entryMode === 'url'}
	<label class="label">
		<span class="text-lg">Paste a long URL</span>
		<input
			class="input w-full h-12 {errors.content ? 'input-error' : ''}"
			type="url"
			multiple={false}
			name="content"
			title="Content"
			aria-label="URL"
			placeholder="Example: https://example.com/long-url"
			on:input={handleContentInput}
			bind:value={content}
			spellcheck="false"
		/>
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
			required
		></textarea>
	</label>
{/if}
{#if errors.content}
	<div class="text-error-500">{errors.content}</div>
{/if}
