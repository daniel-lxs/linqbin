<script lang="ts">
	import { debounce } from 'lodash-es';
	import * as yup from 'yup';
	import { CheckCircle2, X, XCircle } from 'lucide-svelte';
	import UAParser from 'ua-parser-js';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { validateForm } from '../utils/validateForm';
	import { validateUrl } from '../utils/validateUrl';
	import { getPageInfo } from '../api/getPageInfo';
	import { createNewEntry } from '../api/createNewEntry';
	import type { Entry, NewEntryDto } from '../types/Entry';
	import Card from '../components/Card.svelte';
	import ResultCard from '../components/ResultCard.svelte';
	import { onMount } from 'svelte';

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
	let mobile = false;

	// Form values
	let form = {
		title: '',
		ttl: '1',
		content: '',
		visitCountThreshold: '0'
	};

	// Entry and URL-related variables
	let entry: Entry & { passkey: string };

	let entryUrlWithPasskey = '';
	let entryUrl = '';

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
			.max(255, 'Title is too long'),
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
			.max(10000, 'Content is too long'),
		visitCountThreshold: yup.number().integer().min(0, 'Invalid visit count threshold')
	});

	// Function to fetch data with debounce
	const fetchData = debounce(async () => {
		try {
			const newEntry: NewEntryDto = {
				title: form.title === '' ? undefined : form.title,
				content: form.content,
				ttl: Number(form.ttl),
				visitCountThreshold: Number(form.visitCountThreshold)
			};

			entry = await createNewEntry(newEntry);
			entryUrlWithPasskey = `${window.location.origin}/${entry.slug}-${entry.passkey}`;
			entryUrl = `${window.location.origin}/${entry.slug}`;

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
		errors = await validateForm(form, formSchema);
		if (Object.keys(errors).length === 0) {
			fetchData();
			isLoading = false;
		} else {
			isLoading = false;
		}
	}

	// Textarea input handler
	let rows = 1;
	let isValidUrl = false;
	async function handleTextareaInput() {
		errors.content = '';

		isValidUrl = await validateUrl(form.content);
		const hasContent = form.content !== '';
		const hasTitle = form.title !== '';

		if (!isValidUrl && hasContent) {
			rows = 5;
		} else {
			if (!hasTitle && hasContent) {
				getPageTitle();
			}
			rows = 1;
		}
	}

	// Title blur handler
	async function handleTitleBlur() {
		isValidUrl = await validateUrl(form.content);
		if (isValidUrl && form.title === '' && !isLoadingTitle && form.content !== '') {
			getPageTitle();
		}
	}

	// Get page title function
	async function getPageTitle() {
		isLoadingTitle = true;
		try {
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

	// UA Parser initialization
	let parser = new UAParser();
	onMount(() => {
		parser.setUA(navigator.userAgent);
		mobile = parser.getResult().device['type'] == 'mobile';
	});
</script>

<div class="flex items-center justify-center h-full">
	{#if !entry}
		<Card>
			<header class="card-header">
				<h3 class="h3">Create new temporary link</h3>
				<p class="mt-2">Paste your URL(s) to create a new temporary short link</p>
			</header>
			<section class="p-4">
				<form on:submit|preventDefault={handleSubmit}>
					<div class=" mt-4 mb-4">
						<textarea
							class="textarea variant-form-material {errors.content ? 'input-error' : ''}"
							{rows}
							placeholder="Paste your URL(s) here..."
							name="content"
							aria-label="URL(s)"
							bind:value={form.content}
							on:input={handleTextareaInput}
							spellcheck="false"
							title="Paste your URL(s) here..."
							required
						></textarea>
						{#if errors.content}
							<div class="text-error-500">{errors.content}</div>
						{/if}
						{#if form.content !== ''}
							<div class="flex items-center">
								{#if !isValidUrl}
									<span
										class="badge-icon variant-filled-error mr-1"
										title="The content entered is not a valid URL. Automatic redirection will not occur."
									>
										<XCircle size="16" />
									</span>
									<p class="text-sm text-gray-400">Automatic redirection not will occur</p>
								{:else}
									<span
										class="badge-icon variant-filled-success mr-1"
										title="The URL is valid and will be used for automatic redirection."
									>
										<CheckCircle2 size="16" />
									</span>
									<p class="text-sm text-gray-400">Automatic redirection will occur</p>
								{/if}
							</div>
						{/if}
						<div class="mt-6 w-full grid-cols-[1fr_auto] relative">
							<input
								class="input variant-form-material pl-3 pr-8 {errors.title ? 'input-error' : ''}"
								type="text"
								name="title"
								aria-label="Title"
								placeholder={isLoadingTitle ? 'Loading Title...' : 'Title (Optional)'}
								bind:value={form.title}
								on:blur={handleTitleBlur}
								on:input={() => (errors.title = '')}
								title="Title (Optional)"
							/>
							{#if !isLoadingTitle && form.title !== ''}
								<button
									class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
									on:click={() => (form.title = '')}
									title="Clear title"
								>
									<X />
								</button>
							{/if}
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
	{:else}
		<ResultCard {entry} {entryUrl} {entryUrlWithPasskey} {mobile} />
	{/if}
</div>
