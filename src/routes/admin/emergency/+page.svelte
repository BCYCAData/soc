<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data }: Props = $props();
	let emergencyAdminData = data.emergencyAdminData;
</script>

<svelte:head>
	<title>Emergency Administration</title>
</svelte:head>
<div>
	<h1>This will probabley contain information about hoow to use the contained pages</h1>
</div>
