<script lang="ts">
	import '../../../../app.postcss';
</script>

<svelte:head>
	<title>Know Your Neighbour Groups</title>
</svelte:head>

<section class="wrapper grid h-full text-surface-950">
	<div class="main-headlines mx-auto text-center">
		<h1 class="h1 hidden text-orange-600 sm:mt-1 sm:block sm:text-4xl">
			Strengthen Our Community - KYNGs
		</h1>
	</div>
	<div class="about-content mx-auto">
		<p class="mb-0 text-justify">
			Our community led project, by supporting 'old principles' with technology (digital mapping),
			formalising geographic communities and providing opportunities to share and develop knowledge,
			ensures our community will be prepared for future challenges, more connected, and empowered to
			take action and rebound more quickly following an emergency. Relationships are key, they build
			community strength. We can make a difference by working together.
		</p>
		<h2 class="h2 my-2 text-center text-orange-600">
			Your Neighbours will always be your first responders!
		</h2>
	</div>
	<div class="main-list pl-4">
		<h3 class="h3">WHAT ARE KYNGS? - Know Your Neighbour Groups</h3>
		<p class="my-2">
			KYNGs are smaller groups within the community and live on adjoining roads. These groups focus
			on connections and strengthening two-way communication lines. In an emergency, messages to
			KYNG co-ordinators can be shared with their group and critical information shared with
			emergency services.
		</p>
		<p class="my-2">
			KYNG Co-ordinators will initially gather and share information, create connections and
			relationships. Who knows where else this can go?
		</p>
		<p class="my-2">
			One size doesn’t suit all, so we will provide a very simple structure and allow the group
			itself to decide on the best methods of sharing information for them.
		</p>
		<h3 class="h3">KYNG Co-ordinator Role</h3>
		<ol class="mt-0 list-inside list-disc">
			<li class="m-1">Connect with the people in your area.</li>
			<li class="m-1">
				Explain what KYNGs are and why they are important - sharing information (two-way flow),
				supporting each other in an emergency, providing information to emergency services.
			</li>
			<li class="m-1">Collect and keep up to date contact info.</li>
			<li class="m-1">Agree with group most suitable methods of passing information.</li>
			<li class="m-1">Have a trial run of the agreed methods, make any changes.</li>
			<li class="m-1">Ask people to complete their personal profile.</li>
			<li class="m-1">
				Once a year ask people to review and update the info in their personal profile
			</li>
		</ol>
	</div>
	<div class="final-content text-primary text-scale-5 mx-auto pt-2 text-center">
		<strong><em>Not everyone will want to be part of the program and that is fine.</em></strong>
		<br />
		<strong>Everyone is responsible for their own safety.</strong>
		<br />
		<strong>We are only sharing information, not offering advice.</strong>
		<br />
		<strong>Keep yourself safe.</strong>
	</div>
</section>

<style>
	.main-headlines {
		grid-area: headlines;
	}
	.main-list {
		grid-area: list;
	}
	.about-content {
		grid-area: content-words;
	}
	.final-content {
		grid-area: final-words;
	}
	.wrapper {
		display: grid;
		/* grid-template-rows: 45px auto 1fr 2fr; */
		/* grid-auto-rows: min-content; */
		grid-template-columns: 0.5fr 2fr auto 2fr 0.5fr;
		grid-template-areas:
			'. headlines headlines headlines . '
			'. content-words content-words content-words . '
			'. list list list . '
			'. final-words final-words final-words .';
		grid-template-rows: auto auto auto 1fr;
	}
</style>
