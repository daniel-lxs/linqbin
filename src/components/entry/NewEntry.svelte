<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import UAParser from 'ua-parser-js';
	import { Check, Copy } from 'lucide-svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { Entry } from '../../types/Entry';

	let isCopied = false;

	let parser = new UAParser();
	parser.setUA(navigator.userAgent);
	let mobile = parser.getResult().device['type'] == 'mobile';

	export let entry: Entry;

	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	let newUrl = '';
	$: if (entry) {
		newUrl = `${window.location.origin}/e/${entry.slug}`;
	}

	function handleCopyClick() {
		isCopied = true;
		navigator.clipboard.writeText(newUrl);
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	}

	function handleShareClick() {
		// Implement share functionality, e.g., using the Web Share API
		if (navigator.share) {
			navigator
				.share({
					title: entry.title,
					url: newUrl
				})
				.then(() => {
					console.log('Successfully shared');
				})
				.catch((error) => {
					console.error('Error sharing:', error);
				});
		} else {
			// Fallback for browsers that do not support the Web Share API
			console.log('Web Share API is not supported in your browser.');
		}
	}
</script>

<div class="card variant-ghost p-6 mb-8 shadow-xl max-w-3xl w-full mx-auto">
	<header class="card-header">
		<h3 class="h3">Your new temporary link is ready</h3>
	</header>
	<section class="p-4">
		{#if entry && entry.title}
			<p class="text-sm">{entry.title}</p>
		{/if}
		<div class="card variant-soft p-4 flex items-start">
			<section class="p-1 min-h-0">
				<p>{newUrl}</p>
			</section>
			<button
				type="button"
				class="btn btn-sm p-1 ml-auto flex-shrink-0"
				on:click={handleCopyClick}
				use:popup={popupCopied}
			>
				{#if isCopied}
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
