<script lang="ts">
	export let label: string;
	export let placeholder: string = '';
	export let error: string = '';
	export let value: string = '';
</script>

<div class="mt-6 w-full grid-cols-[1fr_auto] relative">
	<div class="relative w-full md:w-1/2">
		<label class="label mb-6">
			<span>{label}</span>
			<input
				class="input h-12 pl-3 pr-9 {error ? 'input-error' : ''}"
				type="text"
				name={label.toLowerCase()}
				aria-label={label}
				{placeholder}
				bind:value
				on:input={() => (error = '')}
				title={label}
				maxlength="100"
			/>
			{#if error}
				<div class="ml-2 text-error-500">{error}</div>
			{/if}
		</label>
	</div>
</div>
