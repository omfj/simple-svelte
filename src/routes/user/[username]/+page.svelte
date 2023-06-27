<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<h1 class="text-3xl font-medium">Profile: {data.user.username}</h1>
