<script lang="ts">
	import { enhance } from '$app/forms';
	import { user } from '$lib/stores/user';
</script>

<header class="flex items-center justify-between px-4 py-2">
	<a href="/">
		<h1 class="text-xl font-semibold p-2 hover:bg-gray-100 rounded">SimpleSvelte</h1>
	</a>

	<nav class="ml-5">
		<ul class="flex">
			{#if $user}
				<li>
					<a class="block p-2 rounded hover:bg-gray-100" href={`/user/${$user.username}`}
						><span aria-hidden="true">👤</span>
						Profile</a
					>
				</li>
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
					<a class="block p-2 rounded hover:bg-gray-100" href="/login">
						<span aria-hidden="true">🔑</span>
						Log in</a
					>
				</li>
				<li>
					<a class="block p-2 rounded hover:bg-gray-100" href="/register">
						<span aria-hidden="true">🔨</span>
						Register</a
					>
				</li>
			{/if}
		</ul>
	</nav>
</header>
<hr class="mb-5" />
