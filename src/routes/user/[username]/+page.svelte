<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const { user } = data;
</script>

<p class="text-sm">{user.id}</p>
<h1 class="text-2xl font-medium">Viewing the profile of: {user.username}</h1>
<p class="text-lg">Email: {user.email}</p>
