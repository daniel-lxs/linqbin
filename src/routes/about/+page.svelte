<script lang="ts">
	import Card from '$lib/components/simple/Card.svelte';
</script>

<svelte:head>
	<title>About | Linqbin</title>
	<meta name="description" content="Create temporary links with Linqbin" />
</svelte:head>

<div class="flex items-center justify-center">
	<Card>
		<header class="card-header">
			<h2 class="h2">About</h2>
		</header>

		<section class="p-4">
			<div class="mt-4">
				<h3 class="h3 text-xl font-semibold mb-2">What is Linqbin?</h3>
				<p>
					<a href="https://github.com/daniel-lxs/linqbin" class="text-blue-500">Linqbin</a> is a project
					designed to serve as a temporary and encrypted link shortener service.
				</p>

				<h3 class="h3 text-xl font-semibold mt-8 mb-2">What does it do?</h3>
				<p>
					Linqbin is a tool that allows you to create short links that can redirect to a chosen URL
					or contain plain text. Every short link generated is encrypted and temporary, allowing you
					to set a specific duration or number of visits after which the link will expire and can't
					be accessed again.
				</p>
			</div>

			<div class="mt-8">
				<h3 class="h3 text-xl font-semibold mb-2">Disclaimer</h3>
				<p>
					Linqbin has no access to your data. Every link created is encrypted and we can't access
					the contents of the link. <br /> If you want to report a link that contains inappropriate
					or illegal content, or malware, please contact me by opening an issue on GitHub. <br /> If
					it's found that the link is indeed unwanted or malicious, immediate actions will be taken.
				</p>
			</div>

			<div class="mt-8">
				<h3 class="h3 mb-2 text-xl font-semibold mb-2">The project is built using:</h3>
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
				<p class="mt-4">
					Linqbin is completely open source and free to use. The project is licensed under the <a
						href="https://github.com/daniel-lxs/linqbin/blob/main/LICENSE.md"
						class="text-blue-500">MIT</a
					>
					license, so it is provided freely and as-is, with no warranty. You can find the source code
					on <a href="https://github.com/daniel-lxs/linqbin" class="text-blue-500">GitHub</a>.
				</p>
			</div>
		</section>
	</Card>
</div>
