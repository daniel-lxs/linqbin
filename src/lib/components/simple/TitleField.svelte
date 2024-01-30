<script lang="ts">
	import { X } from 'lucide-svelte';

	export let errors: Record<string, string> = {};
	export let title = '';
</script>

<div class="mt-6 w-full grid-cols-[1fr_auto] relative">
	<div class="relative w-full md:w-1/2">
		<label class="label mb-6">
			<span class="text-lg">Enter a title</span>
			<input
				class="input h-12 pl-3 pr-9 {errors.title ? 'input-error' : ''}"
				type="text"
				name="title"
				aria-label="Title"
				placeholder="Title (Optional)"
				bind:value={title}
				on:input={() => (errors.title = '')}
				title="Title (Optional)"
				maxlength="100"
			/>
		</label>
		{#if title !== ''}
			<button
				type="button"
				class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
				on:click={() => (title = '')}
				title="Clear title"
			>
				<X />
			</button>
		{/if}
	</div>
	{#if errors.title}
		<div class="text-error-500">{errors.title}</div>
	{/if}
</div>
