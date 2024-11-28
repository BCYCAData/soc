<script lang="ts">
	import Tabs from '$components/page/tabs/TabContainer.svelte';

	import ProjectTab from '$components/page/tabs/about/ProjectTab.svelte';
	import KYNGsTab from '$components/page/tabs/about/KYNGsTab.svelte';
	import HallInfoHubTab from '$components/page/tabs/about/HallInfoHubTab.svelte';
	import WorkshopsTab from '$components/page/tabs/about/WorkshopsTab.svelte';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	console.log('addressPoints:', data.projectAddressPointData);

	// List of tab items with labels, values and assigned components
	let items = [
		{ label: 'SOC Project', value: 1, component: ProjectTab, props: data.projectAddressPointData },
		{ label: 'Know Your Neighbour Groups', value: 2, component: KYNGsTab },
		{ label: 'BCYCA Hall as Info Hub', value: 3, component: HallInfoHubTab },
		{ label: 'Workshops', value: 4, component: WorkshopsTab }
	].filter((item) => item.component);
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Tabs {items} />
<footer class="mt-auto">
	<div class="flex items-center justify-between">
		<picture>
			<source srcset="/images/ag.webp" type="image/webp" />
			<img
				class="md:ml-26 mb-2 ml-2 h-10"
				src="/images/ag.png"
				alt="Australian Government logo"
				width="auto"
				height="40"
			/>
		</picture>
		<p class="md:text-scale-3 p-0 text-center text-[0.6rem] leading-3">
			This is a Bushfire Community Recovery &amp; Resilience Fund project through the joint
			Commonwealth/State Disaster Recovery Funding Arrangements
		</p>
		<picture>
			<source srcset="/images/nswg.webp" type="image/webp" />
			<img class="md:mr-26 mb-2 mr-2 h-10" src="/images/nswg.jpg" alt="NSW Government logo" />
		</picture>
	</div>
</footer>
