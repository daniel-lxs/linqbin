<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { Check, Copy } from 'lucide-svelte';

	export let content: string;

	let isCopied: boolean;

	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	function handleCopyClick() {
		isCopied = true;
		navigator.clipboard.writeText(content);
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	}
</script>

<div class="card variant-soft p-4 sm:w-full flex items-start">
	<section class="p-1 max-w-full" style="word-wrap: break-word;">
		<p>{content}</p>
	</section>
	<button
		type="button"
		class="btn btn-sm ml-auto"
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
