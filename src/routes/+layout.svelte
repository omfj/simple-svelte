<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from 'svelte-sonner';
	import { user } from '$lib/stores/user';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	$: user.set(data.user);
</script>

<Toaster />
<Header />

<main class="max-w-2xl mx-auto w-full">
	<slot />
</main>
