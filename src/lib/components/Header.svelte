<script lang="ts">
	import { enhance } from '$app/forms';
	import { user } from '$lib/stores/user';
</script>

<header class="flex items-center p-4">
	<h1 class="text-2xl font-semibold">
		<a href="/">SimpleSvelte</a>
	</h1>

	<nav class="ml-5">
		<ul class="flex">
			<li>
				<a class="block px-2 py-1 hover:bg-gray-100" href="/about">📖 About</a>
			</li>
			<li>
				<a class="block px-2 py-1 hover:bg-gray-100" href="/blog">✍🏻 Blog</a>
			</li>

			{#if $user}
				<li>
					<a class="block px-3 py-1 rounded hover:bg-black/10" href={`/user/${$user.username}`}
						>👤 Profile</a
					>
				</li>
				<li>
					<form action="/logout" method="POST" use:enhance>
						<button class="block px-2 py-1 hover:bg-gray-100" type="submit">🚪 Log out</button>
					</form>
				</li>
			{:else}
				<li>
					<a class="block px-2 py-1 hover:bg-gray-100" href="/login">🔑 Log in</a>
				</li>
				<li>
					<a class="block px-2 py-1 hover:bg-gray-100" href="/register">🔨 Register</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>
