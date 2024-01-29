<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Hourglass, Trash2, TicketX } from 'lucide-svelte';
</script>

<Accordion width="w-full" autocollapse>
	<AccordionItem>
		<svelte:fragment slot="lead"><Hourglass /></svelte:fragment>
		<svelte:fragment slot="summary">The link has expired</svelte:fragment>
		<svelte:fragment slot="content">
			<p class="max-w-md">
        The link is either expired or has reached its maximum allowed visits.
			</p>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="lead"><Trash2 /></svelte:fragment>
		<svelte:fragment slot="summary">The link has been deleted</svelte:fragment>
		<svelte:fragment slot="content">
			<p class="max-w-md">
				The link was reported and subsequently deleted due to its inappropriate or malicious nature.
			</p>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="lead"><TicketX /></svelte:fragment>
		<svelte:fragment slot="summary">You have entered an invalid passkey</svelte:fragment>
		<svelte:fragment slot="content">
			<p class="max-w-md">
				The passkey (found after the '+' or '#' symbol in the URL) provided is invalid.
			</p>
		</svelte:fragment>
	</AccordionItem>
	<!-- ... -->
</Accordion>
