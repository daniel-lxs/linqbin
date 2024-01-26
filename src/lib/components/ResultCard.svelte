<!-- ResultCard.svelte -->

<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { Entry } from '../../types/Entry';
	import CreateLinkButton from '$lib/components/simple/CreateLinkButton.svelte';

	export let entryWithPasskey: Entry & { passkey: string };
	export let entryUrl: string;

	let isCopied1: boolean;
	let isCopied2: boolean;
	let isCopied3: boolean;

	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	function handleCopy1Click() {
		isCopied1 = true;
		navigator.clipboard.writeText(`${entryUrl}+${entryWithPasskey.passkey}`);
		setTimeout(() => {
			isCopied1 = false;
		}, 2000);
	}

	function handleCopy2Click() {
		isCopied2 = true;
		navigator.clipboard.writeText(entryUrl);
		setTimeout(() => {
			isCopied2 = false;
		}, 2000);
	}

	function handleCopy3Click() {
		isCopied3 = true;
		navigator.clipboard.writeText(entryWithPasskey.passkey);
		setTimeout(() => {
			isCopied3 = false;
		}, 2000);
	}
</script>

<div class="card variant-ghost p-6 mb-8 shadow-xl max-w-3xl w-full mt-20 mb-20 mx-auto">
	<header class="card-header mb-2">
		<h3 class="h3">Your new temporary link is ready!</h3>
	</header>
	<section class="p-4">
		{#if entryWithPasskey && entryWithPasskey.title}
			<p class="text-lg mb-4">{entryWithPasskey.title}</p>
		{/if}
		<div class="card variant-soft p-4 flex items-start">
			<section class="p-1 min-h-0">
				<p>{`${entryUrl}+${entryWithPasskey.passkey}`}</p>
			</section>
			<button
				type="button"
				class="btn btn-sm p-1 ml-auto flex-shrink-0"
				on:click={handleCopy1Click}
				use:popup={popupCopied}
			>
				{#if isCopied1}
					<Check size="20" />
				{:else}
					<Copy size="20" />
				{/if}
			</button>
			<aside class="card p-4 variant-filled-primary" data-popup="popupCopied">
				<p>Copied!</p>
				<div class="arrow variant-filled-primary"></div>
			</aside>
		</div>
		<p class="text-sm mt-1 mb-8">Share this link to include the passkey in the URL</p>

		<div class="flex flex-col md:flex-row md:items-center md:justify-center">
			<div class="card variant-soft p-4 w-full flex items-start">
				<section class="p-1 min-h-0">
					<p>{entryUrl}</p>
				</section>
				<button
					type="button"
					class="btn btn-sm p-1 ml-auto flex-shrink-0"
					on:click={handleCopy2Click}
					use:popup={popupCopied}
				>
					{#if isCopied2}
						<Check size="20" />
					{:else}
						<Copy size="20" />
					{/if}
				</button>
				<aside class="card p-4 variant-filled-primary" data-popup="popupCopied">
					<p>Copied!</p>
					<div class="arrow variant-filled-primary"></div>
				</aside>
			</div>
			<div class="card variant-soft p-4 mt-2 sm:mt-0 sm:w-full sm:ml-2 flex items-start">
				<section class="p-1 min-h-0">
					<p>{entryWithPasskey.passkey}</p>
				</section>
				<button
					type="button"
					class="btn btn-sm p-1 ml-auto flex-shrink-0"
					on:click={handleCopy3Click}
					use:popup={popupCopied}
				>
					{#if isCopied3}
						<Check size="20" />
					{:else}
						<Copy size="20" />
					{/if}
				</button>
				<aside class="card p-4 variant-filled-primary" data-popup="popupCopied">
					<p>Copied!</p>
					<div class="arrow variant-filled-primary"></div>
				</aside>
			</div>
		</div>
		<p class="text-sm mt-1">Share this link if you prefer to provide the passkey separately.</p>
	</section>
	<CreateLinkButton />
</div>
