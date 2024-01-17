<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<div class="flex items-center justify-center h-full">
	<Card>
		<header class="card-header">
			<h2 class="h2">About</h2>
		</header>

		<section class="p-4">
			<div class="mt-4">
				<h3 class="text-lg font-semibold mb-2">What is Linqbin?</h3>
				<p>
					Linqbin is a project designed to serve as a temporary and encrypted link shortner service.
				</p>

				<h3 class="text-lg font-semibold mt-4 mb-2">What does it do?</h3>
				<p>
					Linqbin you can create links that contain either plain text or URL(s). If only one URL is
					provided on your entry, Linqbin will automatically redirect to that URL. Every link
					generated is encrypted and temporary, allowing you to set a specific duration or number of
					visits after which the link will expire.
				</p>
			</div>

			<div class="mt-4">
				<p class="mb-2">Technologically, the project is built using:</p>
				<ul class="list-disc list-inside">
					<li>
						<a href="https://kit.svelte.dev/" class="text-blue-500">SvelteKit</a> for the website
					</li>
					<li>
						<a href="https://bun.sh/" class="text-blue-500">Bun</a> and
						<a href="https://hono.dev/" class="text-blue-500">Hono</a> for the backend
					</li>
					<li>
						<a href="https://discord.js.org/" class="text-blue-500">Discord.js</a> for the Discord bot
						functionality
					</li>
				</ul>
			</div>

			<p class="mt-4">
				Linqbin is completely open source and free to use. The project is licensed under the <a
					href="https://github.com/daniel-lxs/linqbin/blob/main/LICENSE.md"
					class="text-blue-500">MIT</a
				>
				license, so it is provided freely and as-is, with no warranty.
			</p>
		</section>
	</Card>
</div>
