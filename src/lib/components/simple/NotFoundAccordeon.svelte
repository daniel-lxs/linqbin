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
				The link has either reach its expiry date or has it has reached the amount of allowed
				visits.
			</p>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="lead"><Trash2 /></svelte:fragment>
		<svelte:fragment slot="summary">The link has been deleted</svelte:fragment>
		<svelte:fragment slot="content">
			<p class="max-w-md">
				The link was reported and deleted due to being innapropriate or malicious.
			</p>
		</svelte:fragment>
	</AccordionItem>
	<AccordionItem>
		<svelte:fragment slot="lead"><TicketX /></svelte:fragment>
		<svelte:fragment slot="summary">You have entered an invalid passkey</svelte:fragment>
		<svelte:fragment slot="content">
			<p class="max-w-md">
				The passkey (what follows the '+' or '#' symbol in the url) provided is invalid.
			</p>
		</svelte:fragment>
	</AccordionItem>
	<!-- ... -->
</Accordion>
