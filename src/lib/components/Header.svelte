<script lang="ts">
	import { enhance } from '$app/forms';
	import { user } from '$lib/stores/user';
</script>

<header class="flex items-center justify-between px-4 py-2">
	<a href="/">
		<h1 class="text-xl font-semibold p-2 hover:bg-gray-100 rounded">Simple Svelte</h1>
	</a>

	<nav class="ml-5">
		<ul class="flex">
			{#if $user}
				<li>
					<form action="/logout" method="POST" use:enhance>
						<button class="block p-2 rounded hover:bg-gray-100" type="submit">
							<span aria-hidden="true">🚪</span>
							Log out</button
						>
					</form>
				</li>
			{:else}
				<li>
					<a class="block p-2 rounded hover:bg-gray-100" href="/sign-in">
						<span aria-hidden="true">🔑</span>
						Sign in</a
					>
				</li>
			{/if}
		</ul>
	</nav>
</header>
