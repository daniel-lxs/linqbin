<script lang="ts">
	import type { Entry } from '../../types/Entry';
	import CreateLinkButton from '$lib/components/simple/CreateLinkButton.svelte';
	import CopyField from './simple/CopyField.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let entryWithPasskey: Entry & { passkey: string };
	export let entryUrl: string;

	let decryptInBrowser = false;
</script>

<div class="card p-6 mb-8 shadow-xl max-w-3xl w-full mt-6 sm:mt-20 mb-20 mx-auto">
	<header class="card-header mb-2">
		<h3 class="h3">Your new temporary link is ready!</h3>
	</header>
	<section class="p-4">
		{#if entryWithPasskey && entryWithPasskey.title}
			<p class="text-lg mb-4">{entryWithPasskey.title}</p>
		{/if}

		<CopyField content={`${entryUrl}${decryptInBrowser ? '#' : '+'}${entryWithPasskey.passkey}`} />

		<p class="text-sm mt-1 mb-8">Share this link to include the passkey in the URL</p>

		<div
			class="flex flex-col md:flex-row md:items-center md:justify-center space-x-0 space-y-2 sm:space-x-2 sm:space-y-0"
		>
			<CopyField content={`${entryUrl}`} />
			<span class="text-lg hidden md:block"
				>{#if decryptInBrowser}#{:else}+{/if}</span
			>
			<CopyField content={entryWithPasskey.passkey} />
		</div>
		<p class="text-sm mt-1">Share this link if you prefer to provide the passkey separately.</p>

		<div class=" mt-6 variant-soft rounded-lg border-0 p-4">
			<label class="label mb-2 font-bold" for="decrypt-location">Decryption Method</label>
			<SlideToggle
				name="decrypt-location"
				active="bg-surface-900 dark:bg-primary-400"
				size="sm"
				bind:checked={decryptInBrowser}
				label="Decryption Method">Decrypt content in the browser</SlideToggle
			>
		</div>

		<CreateLinkButton />
	</section>
</div>
