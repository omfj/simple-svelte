<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

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

<h1 class="text-3xl font-medium mb-5">Register</h1>

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
		<label for="email">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			class="p-2 border bg-gray-100 rounded"
			bind:value={$form.email}
			{...$constraints.email}
		/>
		{#if $errors.email}
			<p class="text-red-500">{$errors.email}</p>
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

	<div class="flex flex-col gap-2">
		<label for="passwordConfirm">Confirm Password</label>
		<input
			type="password"
			name="passwordConfirm"
			id="passwordConfirm"
			class="p-2 border bg-gray-100 rounded"
			bind:value={$form.passwordConfirm}
			{...$constraints.passwordConfirm}
		/>
		{#if $errors.passwordConfirm}
			<p class="text-red-500">{$errors.passwordConfirm}</p>
		{/if}
	</div>

	<div>
		<button type="submit" class="bg-blue-600 text-white rounded-md p-2">Register</button>
	</div>
</form>
