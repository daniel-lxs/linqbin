<script lang="ts">
	import { page } from '$app/stores';
	import { Cylinder } from 'lucide-svelte';
	import '../app.css';
	import '../app.pcss';
	import {
		AppShell,
		AppBar,
		TabGroup,
		TabAnchor,
		initializeStores,
		Toast
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { checkApi } from '../api/checkApi';
	import { onMount } from 'svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	initializeStores();

	const toastStore = getToastStore();

	let connected = false;

	const t: ToastSettings = {
		message: '',
		background: 'variant-filled-error',
		timeout: 3000
	};

	async function checkApiStatus() {
		while (!connected) {
			const result = await checkApi();
			if (result) {
				connected = true;
			} else {
				t.message = 'Failed to connect to API';
				toastStore.clear();
				toastStore.trigger(t);
				console.log('Failed to connect to API, retrying in 5 seconds...');
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		}
	}

	onMount(() => {
		checkApiStatus();

		setInterval(checkApiStatus, 5000);
	});

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Toast />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-2xl">
			<svelte:fragment slot="lead"
				><a class="w-auto flex" href="/"
					><Cylinder size="28" class="pr-1" /><strong class="h1 text-xl">linqbin</strong></a
				></svelte:fragment
			>
			<svelte:fragment slot="trail">
				<TabGroup
					justify="justify-center"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flex="flex-1 lg:flex-none"
					rounded=""
					border=""
					class="bg-surface-100-800-token w-full"
				>
					<TabAnchor class="mr-6 rounded" href="/" selected={$page.url.pathname === '/'}
						>New</TabAnchor
					>
					<TabAnchor class="rounded" href="/about" selected={$page.url.pathname === '/about'}>
						<span>About</span>
					</TabAnchor>
				</TabGroup>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
