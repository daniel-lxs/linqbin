<script lang="ts">
	import Card from '$lib/components/simple/Card.svelte';
	import SmallCard from '$lib/components/simple/SmallCard.svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Accordion, AccordionItem, popup } from '@skeletonlabs/skeleton';
	import { Check, Copy, Frown } from 'lucide-svelte';
	import type { Entry } from '../../types/Entry';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import NotFoundReasons from '$lib/components/simple/NotFoundReasons.svelte';
	import CreateLinkButton from '$lib/components/simple/CreateLinkButton.svelte';

	export let data: PageData;

	// State variables
	let isLoading = true;
	let shouldRedirect = false;
	let isCopied = false;
	let redirectMessage = 'Redirecting...';
	let decryptedContent: string | null = null;
	let passkey: string | null = '';
	let passkeyError = '';
	let inputPasskey = '';

	// Popup settings for copy functionality
	const popupCopied: PopupSettings = {
		event: 'click',
		target: 'popupCopied',
		placement: 'top'
	};

	// Icon size
	const iconSize = '2.5rem';

	async function processEntry(entry: Entry | null, passkey: string | null) {
		if (!data.slug) {
			redirectToHomepage();
			return;
		}

		if (!entry || !passkey) {
			setLoading(false);
			return;
		}

		try {
			const { decryptContent } = await import('$lib/utilities');
			decryptedContent = await decryptContent(entry.content, passkey);

			if (!decryptedContent) {
				setLoading(false);
				return;
			}

			await handleValidContent();
		} catch (error) {
			redirectToHomepage();
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	async function handleValidContent() {
		const { validateUrl } = await import('$lib/utilities');
		const [isURLValid] = await Promise.all([validateUrl(decryptedContent as string)]);

		if (isURLValid) {
			shouldRedirect = true;
			redirectToDecryptedContent();
		}
	}

	function redirectToHomepage() {
		window.location.href = '/';
	}

	function redirectToDecryptedContent() {
		window.location.href = decryptedContent as string;
	}

	async function handleUnlock() {
		const yup = await import('yup');
		if (yup.string().length(6).required().isValidSync(inputPasskey)) {
			redirectToDynamicUrl();
		} else {
			passkeyError = 'Invalid passkey';
		}
	}

	function redirectToDynamicUrl() {
		window.location.href = `/${data.slug}-${inputPasskey}`;
	}

	// Copy click handler
	function handleCopyClick() {
		isCopied = true;
		copyToClipboard(decryptedContent as string);
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	}

	function copyToClipboard(content: string) {
		navigator.clipboard.writeText(content);
	}

	function setLoading(value: boolean) {
		isLoading = value;
	}

	onMount(async () => {
		passkey = data.passkey;
		if (!passkey) passkey = $page.url.hash.substring(1);
		await processEntry(data.entry, passkey);
	});
</script>

<svelte:head>
	{#if !data.entry}
		<title>Linqbin</title>
	{:else}
		<title>{data.entry.title ? data.entry.title : 'Untitled link'}</title>
	{/if}
	<meta name="description" content="Create temporary links with Linqbin" />
</svelte:head>

<div class="flex items-center justify-center">
	{#if data.slug}
		{#if isLoading}
			<Card>
				<header class="card-header">
					<div class="placeholder w-1/3 h-6 mb-4 animate-pulse" />
				</header>
				<section class="p-4">
					<div class="card variant-soft p-4">
						<div class="placeholder w-full h-16 animate-pulse" />
					</div>
				</section>
			</Card>
		{:else if !passkey}
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
							bind:value={inputPasskey}
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
							<p class="whitespace-pre-wrap">
								{decryptedContent}
							</p>
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
				<CreateLinkButton />
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
					<p class="text-lg text-center mb-4">
						You are seeing this page for one of the following reasons:
					</p>
					<NotFoundReasons />
					<CreateLinkButton />
				</section>
			</SmallCard>
		{/if}
	{/if}
</div>
