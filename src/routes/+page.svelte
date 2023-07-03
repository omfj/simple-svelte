<script lang="ts">
	import { user } from '$lib/stores/user';
</script>

<div class="space-y-4">
	<h1 class="text-3xl">Welcome to SimpleSvelte</h1>

	<div>
		{#if $user}
			<p>You are logged in as {$user.username}</p>
		{:else}
			<p>You are not logged in</p>
		{/if}
	</div>

	<p>
		SimpleSvelte is a simple SvelteKit template that includes a few features that are common to most
		web applications.
	</p>

	<ul class="list-disc ml-5">
		<li>
			<a class="text-blue-500 hover:no-underline underline" href="https://tailwindcss.com/"
				>Tailwind CSS</a
			> for styling
		</li>
		<li>
			<a class="text-blue-500 hover:no-underline underline" href="https://orm.drizzle.team/"
				>Drizzle ORM</a
			> for database access
		</li>
		<li>
			<a class="text-blue-500 hover:no-underline underline" href="https://svelte.dev/">Svelte</a> for
			the frontend
		</li>
		<li>
			<a class="text-blue-500 hover:no-underline underline" href="https://kit.svelte.dev/"
				>SvelteKit</a
			>
			for the backend
		</li>
		<li>
			<a class="text-blue-500 hover:no-underline underline" href="https://www.typescriptlang.org/"
				>TypeScript</a
			> for type-safety
		</li>
		<li>
			<a class="text-blue-500 hover:no-underline underline" href="https://superforms.rocks/"
				>SuperForm</a
			> for form handling
		</li>
	</ul>
</div>
