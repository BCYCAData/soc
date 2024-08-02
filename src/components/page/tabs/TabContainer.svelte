<script lang="ts">
	import '../../../app.postcss';

	interface TabItem {
		label: string;
		value: number;
		component: any;
		props?: Record<string, any>;
	}

	interface Props {
		items: TabItem[];
	}

	let { items = [] }: Props = $props();
	let activeTabValue = $state(1);

	const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
</script>

<ul>
	{#each items as item}
		<li
			class={activeTabValue === item.value ? 'active' : ''}
			role="tab"
			aria-selected={activeTabValue === item.value}
		>
			<span
				role="button"
				tabindex="0"
				onclick={handleClick(item.value)}
				onkeydown={(event) => {
					if (event.key === 'Enter') handleClick(item.value);
				}}
			>
				{item.label}
			</span>
		</li>
	{/each}
</ul>
{#each items as item}
	{#if activeTabValue == item.value}
		<div class="box">
			<svelte:component this={item.component} {...item.props} />
		</div>
	{/if}
{/each}

<style>
	.box {
		background-color: var(--tab-active-bg);
		padding-bottom: 40px;
		border: 1px solid #dee2e6;
		border-radius: 0 0 0.5rem 0.5rem;
		border-top: 0;
		background-color: rgb(253, 186, 116);
	}
	ul {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
	}
	li {
		margin-bottom: -1px;
		margin-inline-end: 5px;
	}

	span {
		border: 1px solid transparent;
		border-bottom: 2px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	span:hover {
		border-color: #e9ecef #e9ecef #dee2e6;
	}

	li > span {
		margin-top: 5px;
		background-color: var(--tab-inactive-bg);
		color: var(--tab-inactive-color);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	li.active > span {
		font-weight: bolder;
		background-color: var(--tab-active-bg);
		color: var(--tab-active-color);
		border-bottom: 3px solid var(--tab-active-bg) !important;
	}
</style>
