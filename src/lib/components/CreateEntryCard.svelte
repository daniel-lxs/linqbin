<script lang="ts">
	import Card from '$lib/components/simple/Card.svelte';
	import { getToastStore, Tab, TabGroup, type ToastSettings } from '@skeletonlabs/skeleton';
	import { debounce } from 'lodash-es';
	import { ArrowDownToLine, X } from 'lucide-svelte';
	import * as yup from 'yup';
	import type { Entry, NewEntryDto } from '../../types/Entry';

	// Toaster initialization
	const toastStore = getToastStore();
	const t: ToastSettings = {
		message: '',
		background: 'variant-filled-error',
		timeout: 3000
	};

	// State variables
	let isLoading = false;
	let isLoadingTitle = false;
	let entryMode = 'url';

	// Form values
	let form = {
		title: '',
		ttl: '1',
		content: '',
		visitCountThreshold: '0'
	};

	// Entry and URL-related variables
	export let entryWithPasskey: Entry & { passkey: string };
	export let entryUrl = '';

	// Error tracking
	let errors: Record<string, string> = {};

	// Form schema validation
	const formSchema = yup.object().shape({
		title: yup
			.string()
			.transform((value, originalValue) => {
				return !originalValue || /^\s*$/.test(originalValue) ? undefined : value;
			})
			.min(3, 'Title is too short')
			.max(100, 'Title is too long'),
		ttl: yup
			.number()
			.integer()
			.required('Select an expiration time')
			.min(1, 'Select an expiration time')
			.max(7 * 24, 'The maximum expiration time is 7 days'),
		content: yup
			.string()
			.required('Content is required')
			.min(3, 'Content is too short')
			.max(10000, 'Content is too long')
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
			t.message = 'Failed to create new entry, please try again later';
			toastStore.trigger(t);
			isLoading = false;
		}
	}, 1000);

	// Form submission handler
	async function handleSubmit() {
		isLoading = true;

		const { validateForm } = await import('$lib/utilities');
		errors = await validateForm(form, formSchema);

		if (Object.keys(errors).length === 0) {
			saveEntry();
		} else {
			isLoading = false;
		}
	}

	// Textarea input handler

	let isValidUrl = false;
	async function handleContentInput() {
		errors.content = '';

		if (entryMode === 'url') {
			const { validateUrl } = await import('$lib/utilities');
			isValidUrl = await validateUrl(form.content);
		}
	}

	// Title blur handler
	async function handleTitleBlur() {
		const { validateUrl } = await import('$lib/utilities');
		isValidUrl = await validateUrl(form.content);
		if (isValidUrl && form.title === '' && !isLoadingTitle && form.content !== '') {
			getPageTitle();
		}
	}

	// Get page title function
	async function getPageTitle() {
		isLoadingTitle = true;
		try {
			const { getPageInfo } = await import('../../api/getPageInfo');
			const pageInfo = await getPageInfo(form.content);

			if (!pageInfo) {
				t.message = 'Failed to parse page info';
				toastStore.trigger(t);
				isLoadingTitle = false;
			} else {
				errors.title = '';
				form.title = pageInfo.title;
				isLoadingTitle = false;
			}
		} catch (error) {
			t.message = 'Failed to parse page info';
			toastStore.trigger(t);
			isLoadingTitle = false;
		}
	}

	// Tab set
	let tabSet = 0;

	let cardTitle = 'Create a new temporary link';
	let cardDescription = 'Paste your long URL to create a new temporary short link';
	let rows = 1;
	function handleTabClick() {
		if (tabSet === 0) {
			isValidUrl = false;
			entryMode = 'url';
			cardTitle = 'Create a new temporary link';
			cardDescription = 'Paste your long URL to create a new temporary short link';
			rows = 1;
			errors.content = '';
		} else {
			isValidUrl = false;
			entryMode = 'text';
			cardTitle = 'Create a new temporary entry';
			cardDescription = 'Paste your plain text to create a new temporary entry';
			rows = 10;
			errors.content = '';
		}
	}
</script>

<Card>
	<TabGroup
		justify="justify-center"
		active="variant-filled-primary"
		hover="hover:variant-soft-primary"
		flex="flex-1 lg:flex-none"
		rounded="rounded"
		class="border-b-1 border-surface-400-500-token w-full space-x-2 "
	>
		<Tab class="w-1/4 mb-2" bind:group={tabSet} name="tab1" value={0} on:change={handleTabClick}>
			<span class="text-lg">Link</span>
		</Tab>
		<Tab class="w-1/4 mb-2" bind:group={tabSet} name="tab2" value={1} on:change={handleTabClick}>
			<span class="text-lg">Text</span>
		</Tab>
	</TabGroup>
	<header class="card-header">
		<h3 class="h3">{cardTitle}</h3>
		<p class="mt-4">{cardDescription}</p>
	</header>
	<section class="p-4">
		<form on:submit|preventDefault={handleSubmit}>
			<div class="mt-4 mb-4">
				{#if entryMode === 'url'}
					<input
						class="input variant-form-material w-full {errors.content ? 'input-error' : ''}"
						type="text"
						name="content"
						title="Content"
						aria-label="URL"
						placeholder="Paste your long URL here..."
						on:input={handleContentInput}
						bind:value={form.content}
						spellcheck="false"
					/>
				{:else}
					<textarea
						class="textarea variant-form-material {errors.content ? 'input-error' : ''}"
						{rows}
						placeholder="Enter your plain text here..."
						name="content"
						aria-label="Enter your plain text here..."
						bind:value={form.content}
						on:input={handleContentInput}
						spellcheck="false"
						title="Content"
						required
					></textarea>
				{/if}
				{#if errors.content}
					<div class="text-error-500">{errors.content}</div>
				{/if}
				<div class="mt-6 w-full grid-cols-[1fr_auto] relative">
					<div class="relative w-full md:w-1/2">
						<input
							class="input variant-form-material pl-3 pr-9 {errors.title ? 'input-error' : ''}"
							type="text"
							name="title"
							aria-label="Title"
							placeholder={isLoadingTitle ? 'Loading Title...' : 'Title (Optional)'}
							bind:value={form.title}
							on:blur={handleTitleBlur}
							on:input={() => (errors.title = '')}
							title="Title (Optional)"
							maxlength="100"
						/>
						{#if !isLoadingTitle && form.title !== ''}
							<button
								type="button"
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
								on:click={() => (form.title = '')}
								title="Clear title"
							>
								<X />
							</button>
						{:else if isValidUrl && form.title === ''}
							<button
								type="button"
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
								on:click={() => getPageTitle()}
								title="Fetch title from website"
							>
								<ArrowDownToLine />
							</button>
						{/if}
					</div>
					{#if errors.title}
						<div class="text-error-500">{errors.title}</div>
					{/if}
				</div>
			</div>
			<div class="flex flex-col sm:flex-row sm:flex-wrap">
				<div class="flex flex-col sm:flex-row md:space-x-4 mb-2">
					<div class="sm:w-1/2 md:w-1/3 min-w-36">
						<label class="label mb-2">
							<span>Access Duration:</span>
							<select
								class="select variant-form-material {errors.ttl ? 'input-error' : ''}"
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
								class="select variant-form-material {errors.visitCountThreshold
									? 'input-error'
									: ''}"
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
			<div class="flex items-end justify-end">
				<button class="btn variant-filled-primary h-10 mb-2" type="submit">
					{isLoading ? 'Creating...' : 'Create'}
				</button>
			</div>
		</form>
	</section>
</Card>
