<script lang="ts">
	import { page } from '$app/stores';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		AppBar,
		AppShell,
		TabAnchor,
		TabGroup,
		Toast,
		getToastStore,
		initializeStores,
		storePopup,
		setInitialClassState,
		modeCurrent,
		type ToastSettings,
		setModeCurrent,
		getModeOsPrefers,
		setModeUserPrefers
	} from '@skeletonlabs/skeleton';
	import { Cylinder, Moon, Sun } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { checkApi } from '../api/checkApi';
	import '../app.css';
	import '../app.pcss';

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

	function toggleMode() {
		$modeCurrent = !$modeCurrent;
		setModeUserPrefers($modeCurrent);
		setModeCurrent($modeCurrent);
	}

	onMount(() => {
		checkApiStatus();

		setInterval(checkApiStatus, 5000);

		if (!('modeCurrent' in localStorage)) {
			setModeCurrent(getModeOsPrefers());
		}
	});

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<svelte:head>{@html '<script>(' + setInitialClassState.toString() + ')();</script>'}</svelte:head>

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
					class="bg-surface-100-800-token w-full mr-0 sm:mr-2"
				>
					<TabAnchor class="mr-0 sm:mr-6 rounded" href="/" selected={$page.url.pathname === '/'}
						>New</TabAnchor
					>
					<TabAnchor class="rounded" href="/about" selected={$page.url.pathname === '/about'}>
						<span>About</span>
					</TabAnchor>
				</TabGroup>

				<div class="pr-0 pl-0 sm:pl-6 sm:pr-2 sm:border-l border-surface-500">
					<button
						class="btn-icon btn-icon-sm rounded-full"
						type="button"
						aria-label="Toggle dark mode"
						title="Toggle dark mode"
						on:click={toggleMode}
					>
						{#if $modeCurrent}
							<Sun size="22" />
						{:else}
							<Moon size="22" />
						{/if}
					</button>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
