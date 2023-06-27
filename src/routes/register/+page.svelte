<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1 class="text-3xl font-medium mb-5">Register</h1>

<form class="space-y-4" method="post" use:enhance>
	<div class="flex flex-col gap-2">
		<label for="username">Username</label>
		<input type="text" name="username" id="username" class="p-2 border bg-gray-200 rounded" />
	</div>

	<div class="flex flex-col gap-2">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" class="p-2 border bg-gray-200 rounded" />
	</div>

	<div class="flex flex-col gap-2">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" class="p-2 border bg-gray-200 rounded" />
	</div>

	<div class="flex flex-col gap-2">
		<label for="passwordConfirm">Confirm Password</label>
		<input
			type="password"
			name="passwordConfirm"
			id="passwordConfirm"
			class="p-2 border bg-gray-200 rounded"
		/>
	</div>

	<div>
		<button type="submit" class="bg-blue-600 text-white rounded-md p-2">Register</button>
	</div>
</form>
