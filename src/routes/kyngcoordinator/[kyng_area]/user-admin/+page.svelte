<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<pre>{JSON.stringify($page.params, null, 2)}</pre>
<h1>User Admin</h1>
