<script lang="ts">
	let { data } = $props();
</script>

<p class="text-sm">{data.user.id}</p>
<h1 class="text-2xl font-medium">Viewing the profile of: {data.user.username}</h1>
<p class="text-lg">Email: {data.user.email}</p>
