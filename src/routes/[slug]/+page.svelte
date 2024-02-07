<script lang="ts">
	import Card from '$lib/components/simple/Card.svelte';
	import SmallCard from '$lib/components/simple/SmallCard.svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import { Check, Copy, Frown } from 'lucide-svelte';
	import type { Entry } from '../../types/Entry';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import NotFoundAccordeon from '$lib/components/simple/NotFoundAccordeon.svelte';
	import CreateLinkButton from '$lib/components/simple/CreateLinkButton.svelte';
	import CopyField from '../../lib/components/simple/CopyField.svelte';
	import UnlockEntryCard from '../../lib/components/UnlockEntryCard.svelte';

	export let data: PageData;

	// State variables
	let isLoading = true;
	let shouldRedirect = false;
	let redirectMessage = 'Redirecting...';
	let decryptedContent: string | null = null;
	let passkey: string | null = '';

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
		<title>{data.entry.title ? data.entry.title : 'Linqbin'}</title>
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
			<UnlockEntryCard slug={data.slug} />
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
					<CopyField content={decryptedContent} />
					<CreateLinkButton />
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
					<p class="text-lg text-center mb-4">
						You are seeing this page for one of the following reasons:
					</p>
					<NotFoundAccordeon />
					<CreateLinkButton />
				</section>
			</SmallCard>
		{/if}
	{/if}
</div>
