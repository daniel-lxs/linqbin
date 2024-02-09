<script lang="ts">
	import CreateLinkButton from '$lib/components/simple/CreateLinkButton.svelte';
	import SmallCard from '$lib/components/simple/SmallCard.svelte';

	export let slug: string;

	let inputPasskey: string | undefined;
	let passkeyError: string | undefined;

	function redirectToUrl() {
		window.location.href = `/${slug}+${inputPasskey}`;
	}

	async function handleUnlock() {
		const yup = await import('yup');
		if (yup.string().length(6).required().isValidSync(inputPasskey)) {
			redirectToUrl();
		} else {
			passkeyError = 'Invalid passkey';
		}
	}
</script>

<SmallCard>
	<div class="flex w-full">
		<header class="card-header">
			<h2 class="h2">Please enter the passkey</h2>
		</header>
	</div>
	<section class="p-0 sm:p-4 mt-4">
		<form class="flex" on:submit|preventDefault={handleUnlock}>
			<input
				class="input h-12"
				type="text"
				name="passkey"
				id="passkey"
				spellcheck="false"
				required
				bind:value={inputPasskey}
				on:input={() => (passkeyError = '')}
				placeholder="Passkey"
			/>
			<button class="btn variant-filled-primary ml-4" type="submit">Unlock</button>
		</form>

		{#if passkeyError}
			<div class="text-error-500">{passkeyError}</div>
		{/if}

		<p class="text-sm text-center mt-4">
			If you've landed on this page by accident, request the passkey from the link creator.
		</p>
		<CreateLinkButton />
	</section>
</SmallCard>
