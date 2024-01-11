<script lang="ts">
	import { page } from '$app/stores';
	import EntryCard from '../../../components/entry/Entry.svelte';

	$: slug = $page.params.slug;
</script>

<div class="flex items-center justify-center h-full">
	<EntryCard {slug} />
</div>
