<script lang="ts">
	import ResultCard from '$lib/components/ResultCard.svelte';
	import type { Entry } from '../types/Entry';
	import CreateEntryCard from '$lib/components/CreateEntryCard.svelte';

	let entryWithPasskey: Entry & { passkey: string };
	let entryUrl = '';
</script>

<svelte:head>
	<title>Linqbin</title>
	<meta name="description" content="Create temporary links with Linqbin" />
</svelte:head>
<div class="flex items-center justify-center h-full">
	{#if !entryWithPasskey}
		<CreateEntryCard bind:entryWithPasskey bind:entryUrl />
	{:else}
		<ResultCard {entryWithPasskey} {entryUrl} />
	{/if}
</div>
