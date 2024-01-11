<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import { findEntryBySlug } from '../../api/getEntryBySlug';
	import { validateUrl } from '../../utils/validateUrl';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { Entry } from '../../types/Entry';
	import Card from '../Card.svelte';
	import { Check, Copy, Frown } from 'lucide-svelte';

	export let slug: string = '';

	let isFetchingEntry = true;
	let shouldRedirect = false;
	let isCopied = false;

	let entry: Entry | null = null;

	let countdown: number;
	let countdownNumber: number = 3;
	let redirectMessage = 'Redirecting...';

	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	const iconSize = '2.5rem';

	const fetchEntry = async () => {
		try {
			entry = await findEntryBySlug(slug);
			if (entry) {
				const isURLValid = await validateUrl(entry.content);
				if (isURLValid) {
					shouldRedirect = true;
					startCountdown();
				}
			}
			isFetchingEntry = false;
		} catch (error) {
			isFetchingEntry = false;
		}
	};

	$: fetchEntry();

	function handleCopyClick() {
		isCopied = true;
		navigator.clipboard.writeText(entry?.content || '');
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	}

	function startCountdown(): void {
		countdown = window.setInterval(() => {
			if (countdownNumber > 0) {
				redirectMessage = `Redirecting in ${countdownNumber}...`;
				countdownNumber--;
			} else {
				window.clearInterval(countdown);
				window.location.href = (entry as Entry).content;
			}
		}, 1000);
	}
</script>

{#if isFetchingEntry}
	<Card>
		<header class="card-header"><div class="placeholder w-1/3 h-6 mb-4 animate-pulse" /></header>
		<section class="p-4">
			<div class="card variant-soft p-4">
				<div class="placeholder w-full h-16 animate-pulse" />
			</div>
		</section>
	</Card>
{:else if entry}
	<Card>
		<header class="card-header">
			{#if shouldRedirect}
				<h3 class="h3">{redirectMessage}</h3>
				<p class="text-lg">{entry.title ? entry.title : 'Untitled link'}</p>
			{:else}
				<h3 class="h3">{entry.title ? entry.title : 'Untitled link'}</h3>
			{/if}
		</header>

		<section class="p-4">
			<div class="card variant-soft p-4 flex items-start">
				<section class="p-1 min-h-0">
					{entry.content}
				</section>
				{#if !shouldRedirect}
					<aside class="card p-4 variant-filled-primary" data-popup="popupCopied">
						<p>Copied!</p>
						<div class="arrow variant-filled-primary" />
					</aside>
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
				{/if}
			</div>
		</section>
	</Card>
{:else}
	<div class="card variant-ghost p-6 mb-8 shadow-xl">
		<div class="flex items-center justify-center w-full">
			<header class="card-header flex items-center">
				<Frown size={iconSize} />
				<h2 class="text-center h2 ml-2">Link not found</h2>
			</header>
		</div>
		<section class="p-4 mt-4">
			<p class="text-lg text-center">The requested link could not be found or has expired</p>
			<div class="flex items-center justify-center w-full">
				<a href="/" class="btn variant-filled-primary mt-8">Create new link</a>
			</div>
		</section>
	</div>
{/if}
