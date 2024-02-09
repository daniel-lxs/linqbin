<script lang="ts">
	import {
		focusTrap,
		getToastStore,
		Tab,
		TabGroup,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash-es';
	import * as yup from 'yup';
	import type { Entry, NewEntryDto } from '../../types/Entry';
	import InputField from '$lib/components/simple/InputField.svelte';
	import ContentField from './simple/ContentField.svelte';
	import { ClipboardPen, Link } from 'lucide-svelte';

	// Toaster initialization
	const toastStore = getToastStore();
	const t: ToastSettings = {
		message: '',
		background: 'variant-filled-error',
		timeout: 3000
	};

	// State variables
	let isFocused: boolean = true;
	let isLoading = false;
	let entryMode: 'text' | 'url' = 'url';
	let isUrlValid = false;
	let validOnce = false;

	// Form values
	let form = {
		title: '',
		ttl: '1',
		content: '',
		visitCountThreshold: '0'
	};

	// Entry and URL-related variables
	export let entryWithPasskey: (Entry & { passkey: string }) | undefined = undefined;
	export let entryUrl = '';

	// Error tracking
	let errors: Record<string, string> = {};

	// Form schema validation
	const formSchema = yup.object().shape({
		title: yup
			.string()
			.strict(true)
			.transform((value, originalValue) => {
				return !originalValue || /^\s*$/.test(originalValue) ? undefined : value;
			})
			.min(3, 'Title is too short')
			.max(100, 'Title is too long'),
		ttl: yup
			.number()
			.strict(true)
			.integer()
			.required('Select an expiration time')
			.min(1, 'Select an expiration time')
			.max(7 * 24, 'The maximum expiration time is 7 days'),
		content: yup
			.string()
			.strict(true)
			.required('This field is required')
			.min(3, 'Input is too short')
			.max(10000, 'Input is too long')
			.when([], {
				is: () => entryMode === 'url',
				then: (schema) => schema.url('Invalid URL')
			}),
		visitCountThreshold: yup.number().integer().min(0, 'Invalid visit count threshold')
	});

	// Function to fetch data with debounce
	const saveEntry = debounce(async () => {
		try {
			const newEntry: NewEntryDto = {
				title: form.title === '' ? undefined : form.title,
				content: form.content,
				ttl: Number(form.ttl),
				visitCountThreshold: Number(form.visitCountThreshold)
			};

			const { createNewEntry } = await import('../../api/createNewEntry');
			entryWithPasskey = await createNewEntry(newEntry);

			entryUrl = `${window.location.origin}/${entryWithPasskey.slug}`;

			isLoading = false;
		} catch (error) {
			triggerToast('Failed to create new entry', 'variant-filled-error', 3000);

			isLoading = false;
		}
	}, 1000);

	// Form submission handler
	async function handleSubmit() {
		isLoading = true;

		const { validateForm } = await import('$lib/utilities');
		errors = await validateForm(form, formSchema);

		if (Object.keys(errors).length === 0) {
			triggerToast('Creating new link...', 'variant-filled-primary', 2000, true);
			saveEntry();
		} else {
			isLoading = false;
		}
	}

	function triggerToast(message: string, background: string, timeout: number, hideDismiss = false) {
		t.background = background;
		t.message = message;
		t.timeout = timeout;
		t.hideDismiss = hideDismiss;
		toastStore.trigger(t);
	}

	// Tab set
	let tabSet = 0;

	let cardTitle = 'Create a new temporary link';
	function handleTabClick() {
		if (tabSet === 0) {
			isUrlValid = false;
			entryMode = 'url';
			cardTitle = 'Create a new temporary link';
			errors = {};
		} else {
			isUrlValid = false;
			entryMode = 'text';
			cardTitle = 'Create a new temporary paste';
			errors = {};
		}
	}
</script>

<div class="card max-w-6xl w-full mx-auto mt-6 sm:mt-20 mb-20 shadow-xl">
	<TabGroup
		justify="justify-center"
		active="variant-ghost-primary"
		hover="hover:variant-soft-primary"
		flex="flex-1 lg:flex-none"
		rounded="rounded"
		class="w-full space-x-2"
	>
		<Tab
			class="w-1/4 pt-4 pb-4 mb-0 flex justify-center"
			bind:group={tabSet}
			name="tab1"
			value={0}
			on:change={handleTabClick}
		>
			<div class="flex items-center">
				<Link />
				<span class="ml-2 text-lg">Short link</span>
			</div>
		</Tab>
		<Tab
			class="w-1/4 pt-4 pb-4 mb-0 flex justify-center"
			bind:group={tabSet}
			name="tab2"
			value={1}
			on:change={handleTabClick}
		>
			<div class="flex items-center">
				<ClipboardPen />
				<span class="ml-2 text-lg">Plain text</span>
			</div>
		</Tab>
	</TabGroup>
	<div class="pl-4 pr-4 pb-4">
		<header class="card-header mt-4">
			<h3 class="h3">{cardTitle}</h3>
		</header>
		<section class="p-4">
			<form use:focusTrap={isFocused} on:submit|preventDefault={handleSubmit}>
				<div class="mt-2 mb-4">
					<ContentField
						{errors}
						{entryMode}
						bind:content={form.content}
						bind:isUrlValid
						bind:validOnce
					/>

					{#if entryMode === 'text'}
						<InputField
							label="Enter a title"
							placeholder="Title (optional)"
							error={errors.title}
							bind:value={form.title}
						/>
					{/if}
				</div>
				<div class="flex flex-col sm:flex-row sm:flex-wrap">
					<div class="flex flex-col sm:flex-row md:space-x-4 mb-2">
						<div class="sm:w-1/2 md:w-1/3 min-w-36">
							<label class="label mb-2">
								<span>Access Duration:</span>
								<select
									class="select {errors.ttl ? 'input-error' : ''}"
									aria-label="Access Duration"
									name="ttl"
									bind:value={form.ttl}
									on:input={() => (errors.ttl = '')}
									title="Select the duration after which the link will expire"
								>
									<option value="1">1 Hour</option>
									<option value="12">12 Hours</option>
									<option value="24">1 Day</option>
									<option value="168">1 Week</option>
								</select>
							</label>
							{#if errors.ttl}
								<div
									class="text-error-500 absolute w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
								>
									{errors.ttl}
								</div>
							{/if}
						</div>

						<div class="sm:w-1/2 md:w-1/3 min-w-36">
							<label class="label mb-2">
								<span>Access Limit:</span>
								<select
									class="select {errors.visitCountThreshold ? 'input-error' : ''}"
									aria-label="Access Limit"
									name="visitCountThreshold"
									bind:value={form.visitCountThreshold}
									on:input={() => (errors.visitCountThreshold = '')}
									title="Select the number of views after which the link expires"
								>
									<option value="0">No Limit</option>
									<option value="1">1 View</option>
									<option value="10">10 Views</option>
									<option value="20">20 Views</option>
									<option value="50">50 Views</option>
									<option value="100">100 Views</option>
								</select>
							</label>
							{#if errors.visitCountThreshold}
								<div
									class="text-error-500 absolute w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
								>
									{errors.ttl}
								</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="flex items-center justify-center sm:items-end sm:justify-end">
					<button
						class="btn variant-filled-primary h-12 mb-2 mt-4 sm:mt-2 w-full sm:w-auto"
						type="submit"
					>
						{isLoading ? 'Creating...' : 'Create'}
					</button>
				</div>
			</form>
		</section>
	</div>
</div>
