<script lang="ts">
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		resetForm: true,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				goto('/');
			}
		}
	});
</script>

<h1 class="text-3xl font-medium mb-5">Login</h1>

<form class="space-y-4" method="post" use:enhance>
	<div class="flex flex-col gap-2">
		<label for="username">Username</label>
		<input
			type="text"
			name="username"
			id="username"
			class="p-2 border bg-gray-100 rounded"
			bind:value={$form.username}
			{...$constraints.username}
		/>
		{#if $errors.username}
			<p class="text-red-500">{$errors.username}</p>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<label for="password">Password</label>
		<input
			type="password"
			name="password"
			id="password"
			class="p-2 border bg-gray-100 rounded"
			bind:value={$form.password}
			{...$constraints.password}
		/>
		{#if $errors.password}
			<p class="text-red-500">{$errors.password}</p>
		{/if}
	</div>

	<div>
		<button type="submit" class="bg-blue-600 text-white rounded-md p-2">Log in</button>
	</div>
</form>
