<script>
	import Card from '$lib/components/simple/Card.svelte';
</script>

<svelte:head>
	<title>About | Linqbin</title>
	<meta name="description" content="Create temporary links with Linqbin" />
</svelte:head>

<div class="flex items-center justify-center">
	<Card>
		<section class="p-4">
			<h3 class="h3 font-semibold mb-2">What is Linqbin?</h3>
			<p class="mb-8">
				Linqbin is an ephemeral link shortener and pastebin (yes, another one) service. All your
				content is encrypted and stays private, only accessible by you and the ones you decide to
				share the shortlink with. The data is encrypted in the browser, and the passkey is not saved
				on our servers, so don't lose it!
			</p>

			<h3 class="h3 font-semibold mb-2">Limits</h3>
			<ul class="list-disc list-inside mb-8">
				<li>The minimum lifespan of a shortlink is 1 hour.</li>
				<li>The maximum lifespan of a shortlink is 1 week.</li>
				<li>20000 characters for the link/paste.</li>
				<li>150 characters for the optional title field.</li>
			</ul>

			<h3 class="h3 font-semibold mb-2">Terms of Service</h3>
			<p class="mb-8">By using our services, you agree to the following terms:</p>
			<ol class="list-decimal list-inside mb-8">
				<li class="mb-2">
					<strong>Content Ownership:</strong> You own the content you create and share using Linqbin.
				</li>
				<li class="mb-2">
					<strong>Privacy:</strong> We respect your privacy. Your data is yours, and we can't access
					it since the encryption occurs in your browser, and the passkey is not saved on our servers.
				</li>
				<li class="mb-2">
					<strong>Ephemeral Links:</strong> Links generated are temporary, with a maximum lifespan of
					1 week.
				</li>
				<li class="mb-2"><strong>Prohibited Activities:</strong> No spamming, illegal content.</li>
				<li class="mb-2">
					<strong>Limitation of Liability:</strong> We're not responsible for any damages or loss related
					to the use of our services.
				</li>
				<li class="mb-2">
					<strong>Termination:</strong> We reserve the right to remove links/entries for violations of
					these terms.
				</li>
			</ol>
			<p class="mb-8">By using Linqbin, you agree to these terms.</p>

			<h3 class="h3 font-semibold mb-2">Reports</h3>
			<p class="mb-8">
				If you want to report a link that contains inappropriate or illegal content, or malware,
				please contact us by opening an issue on <a
					href="https://github.com/daniel-lxs/linqbin/issues"
					class="text-blue-500">GitHub</a
				>. We might take down any link that violates our terms of service in the case that we can
				see the data saved in the link.
			</p>

			<h3 class="h3 font-semibold mb-2">The project is built using:</h3>
			<ul class="list-disc list-inside mb-8">
				<li>
					<a href="https://kit.svelte.dev/" class="text-blue-500">SvelteKit</a> for the website.
				</li>
				<li>
					<a href="https://bun.sh/" class="text-blue-500">Bun</a> and
					<a href="https://hono.dev/" class="text-blue-500">Hono</a> for the backend.
				</li>
				<li>
					<a href="https://discord.js.org/" class="text-blue-500">Discord.js</a> for the Discord bot
					functionality.
				</li>
			</ul>
			<p>
				Linqbin is completely open source and free to use. The project is licensed under the <a
					href="https://github.com/daniel-lxs/linqbin/blob/main/LICENSE.md"
					class="text-blue-500">MIT</a
				>
				license, so it is provided freely and as-is, with no warranty. You can find the source code on
				<a href="https://github.com/daniel-lxs/linqbin" class="text-blue-500">GitHub</a>.
			</p>
		</section>
	</Card>
</div>
