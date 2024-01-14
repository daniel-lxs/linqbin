<!-- ResultCard.svelte -->

<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { Entry } from '../types/Entry';

	export let entry: Entry;
	export let entryUrlWithPasskey: string;
	export let entryUrl: string;
	export let mobile: boolean;

	let isCopied1: boolean;
	let isCopied2: boolean;

	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	function handleCopy1Click() {
		isCopied1 = true;
		navigator.clipboard.writeText(entryUrlWithPasskey);
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

	function handleShareClick() {
		if (navigator.share) {
			navigator
				.share({
					title: entry.title,
					url: entryUrl
				})
				.then(() => {
					console.log('Successfully shared');
				})
				.catch((error) => {
					console.error('Error sharing:', error);
				});
		} else {
			console.log('Web Share API is not supported in your browser.');
		}
	}
</script>

<div class="card variant-ghost p-6 mb-8 shadow-xl max-w-3xl w-full mx-auto">
	<header class="card-header mb-2">
		<h3 class="h3">Your new temporary link is ready!</h3>
	</header>
	<section class="p-4">
		{#if entry && entry.title}
			<p class="text-lg mb-4">{entry.title}</p>
		{/if}
		<div class="card variant-soft p-4 flex items-start">
			<section class="p-1 min-h-0">
				<p>{entryUrlWithPasskey}</p>
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

		<div class="card variant-soft p-4 flex items-start">
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
		<p class="text-sm mt-1">Share this link if you prefer to provide the passkey separately.</p>

		{#if mobile}
			<button
				type="button"
				class="btn btn-sm variant-soft-surface mt-2 mx-auto"
				on:click={handleShareClick}
			>
				Share
			</button>
		{/if}
	</section>
	<div class="flex items-center justify-center">
		<button
			class="btn variant-filled-primary h-10 mb-2 mt-4"
			on:click={() => (window.location.href = '/')}
		>
			Create new link
		</button>
	</div>
</div>
