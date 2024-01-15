<script lang="ts">
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import { Check, Copy, Frown } from 'lucide-svelte';
	import * as yup from 'yup';
	import Card from '../../components/Card.svelte';
	import SmallCard from '../../components/SmallCard.svelte';
	import { decryptContent, validateUrl } from '$lib';
	import type { PageData } from './$types';
	import type { Entry } from '../../types/Entry';

	export let data: PageData;

	// State variables
	let isFetchingEntry = true;
	let shouldRedirect = false;
	let isCopied = false;
	let countdown: number;
	let countdownNumber: number = 3;
	let redirectMessage = 'Redirecting...';
	let decryptedContent: string | null = null;

	// Popup settings for copy functionality
	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	// Icon size
	const iconSize = '2.5rem';

	async function processEntry(entry: Entry | undefined, passkey: string | undefined) {
		try {
			if (!data.slug) {
				window.location.href = '/';
			}

			if (entry && passkey) {
				decryptedContent = await decryptContent(entry.content, passkey);

				if (decryptedContent) {
					const isURLValid = await validateUrl(decryptedContent);
					if (isURLValid) {
						shouldRedirect = true;
						startCountdown();
					}
				}
			}
			isFetchingEntry = false;
		} catch (error) {
			isFetchingEntry = false;
		}
	}

	let passkeyError = '';
	let enteredPasskey = '';

	async function handleUnlock() {
		if (yup.string().length(6).required().isValidSync(enteredPasskey)) {
			window.location.href = `/${data.slug}-${enteredPasskey}`;
		} else {
			passkeyError = 'Invalid passkey';
		}
	}

	// Copy click handler
	function handleCopyClick() {
		isCopied = true;
		navigator.clipboard.writeText(data.entry?.content || '');
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	}

	// Start countdown function
	function startCountdown(): void {
		countdown = window.setInterval(() => {
			if (countdownNumber > 0) {
				redirectMessage = `Redirecting in ${countdownNumber}...`;
				countdownNumber--;
			} else {
				window.clearInterval(countdown);
				window.location.href = decryptedContent as string;
			}
		}, 1000);
	}

	$: processEntry(data.entry, data.passkey);
</script>

<div class="flex items-center justify-center h-full">
	{#if isFetchingEntry}
		<Card>
			<header class="card-header"><div class="placeholder w-1/3 h-6 mb-4 animate-pulse" /></header>
			<section class="p-4">
				<div class="card variant-soft p-4">
					<div class="placeholder w-full h-16 animate-pulse" />
				</div>
			</section>
		</Card>
	{:else if !data.passkey}
		<SmallCard>
			<div class="flex items-center justify-center w-full">
				<header class="card-header flex items-center">
					<h2 class="text-center h2 ml-2">Passkey was not provided</h2>
				</header>
			</div>
			<section class="p-4 mt-4">
				<form class="flex items-center justify-center" on:submit|preventDefault={handleUnlock}>
					<input
						class="input variant-form-material"
						type="text"
						name="passkey"
						id="passkey"
						spellcheck="false"
						required
						bind:value={enteredPasskey}
						on:input={() => (passkeyError = '')}
						placeholder="To access the link, please enter the provided passkey"
					/>
					<button class="btn variant-filled-primary ml-2" type="submit">Unlock</button>
				</form>

				{#if passkeyError !== ''}
					<div class="text-error-500">{passkeyError}</div>
				{/if}

				<p class="text-sm text-center mt-4">
					If you've landed on this page by accident, request the passkey from the link creator.
				</p>
				<div class="flex items-center justify-center w-full">
					<a href="/" class="btn variant-filled-primary mt-8">Create new link</a>
				</div>
			</section>
		</SmallCard>
	{:else if data.entry && decryptedContent}
		<Card>
			<header class="card-header">
				{#if shouldRedirect}
					<h3 class="h3">{redirectMessage}</h3>
					<p class="text-lg">{data.entry.title ? data.entry.title : 'Untitled link'}</p>
				{:else}
					<h3 class="h3">{data.entry.title ? data.entry.title : 'Untitled link'}</h3>
				{/if}
			</header>

			<section class="p-4">
				<div class="card variant-soft p-4 flex items-start">
					<section class="p-1 min-h-0">
						{decryptedContent}
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
		<SmallCard>
			<div class="flex items-center justify-center w-full">
				<header class="card-header flex items-center">
					<Frown size={iconSize} />
					<h2 class="text-center h2 ml-2">Link not found</h2>
				</header>
			</div>
			<section class="p-4 mt-4">
				<p class="text-lg text-center">
					The requested link could not be found, has expired or has an invalid passkey
				</p>
				<div class="flex items-center justify-center w-full">
					<a href="/" class="btn variant-filled-primary mt-8">Create new link</a>
				</div>
			</section>
		</SmallCard>
	{/if}
</div>
