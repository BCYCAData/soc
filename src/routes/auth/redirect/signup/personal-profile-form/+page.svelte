<script lang="ts">
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let havePersonalProfile = data.user?.app_metadata.havePersonalProfile;
</script>

<div class="mx-auto mt-5 flex h-full max-w-3xl flex-col items-center text-center sm:mt-1">
	<h1 class="title-font h1 hidden font-bold text-primary-600 sm:mt-4 sm:block sm:text-4xl">
		Help Protect Yourself and Our Community
	</h1>
	<div
		class="text-scale-4eft mt-2 w-full items-center rounded-lg bg-green-100 p-4 text-surface-950"
	>
		<h2 class="text-scale-6 mb-3 text-center font-bold">
			The First Step Is Your Personal Emergency Information Profile
		</h2>

		<p class="text-scale-3 sm:text-scale-5 mb-3">
			Completing your Personal Emergency Information Profile is crucial for your safety and the
			well-being of our community. This information helps emergency responders act quickly and
			effectively during critical situations.
		</p>

		{#if havePersonalProfile}
			<div class="mb-3 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-900" role="alert">
				<p class="font-bold">Important Update Required</p>
				<p>
					Please review and update your existing profile. We've added new questions to enhance
					emergency preparedness. Ensure all information is current and accurate.
				</p>
				<p class="mt-2"><strong>Remember to save your changes at step 12.</strong></p>
			</div>
		{/if}

		<p class="text-scale-3 sm:text-scale-5 mb-2">By providing this information, you're:</p>
		<ul class="text-scale-3 sm:text-scale-5 mb-3 list-none pl-5">
			<li class="relative mb-1 pl-5">
				<span class="absolute left-0">•</span>Helping emergency services respond more effectively
			</li>
			<li class="relative mb-1 pl-5">
				<span class="absolute left-0">•</span>Improving your own preparedness for fire and flood
			</li>
			<li class="relative pl-5">
				<span class="absolute left-0">•</span>Contributing to the safety of our entire community
			</li>
		</ul>

		<div
			class="mb-3 border-l-4 border-primary-500 bg-primary-100 p-4 text-primary-900"
			role="alert"
		>
			<p class="mb-2 text-center font-bold">Your Privacy is Protected</p>
			<p class="mb-2">We take your privacy seriously. Your information will:</p>
			<ul class="list-none pl-5">
				<li class="relative mb-1 pl-5">
					<span class="absolute left-0">•</span>Never be sold or misused
				</li>
				<li class="relative mb-1 pl-5">
					<span class="absolute left-0">•</span>Only be shared with emergency services during an
					actual emergency
				</li>
				<li class="relative pl-5">
					<span class="absolute left-0">•</span>Remain confidential unless you grant permission for
					access
				</li>
			</ul>
		</div>

		<div class="text-center">
			<a
				href="/personal-profile-form"
				class="text-scale-3 sm:text-scale-5 btn my-5 inline-flex w-full max-w-md cursor-pointer items-center justify-center rounded-xl bg-secondary-500 px-4 py-3 font-semibold text-secondary-50 hover:bg-secondary-700 focus:outline-none"
			>
				Complete Your Personal Emergency Profile Now
			</a>
		</div>

		<p class="text-scale-3 sm:text-scale-5 mt-3 text-center">
			Questions? Contact:
			<br />Helen: <a href="tel:0424515963" class="text-blue-600 hover:underline">0424 515 963</a>
			<br />Christine:
			<a href="tel:0488288661" class="text-blue-600 hover:underline">0488 288 661</a>
		</p>
	</div>
	<h2 class="title-font h2 hidden font-bold text-primary-600 sm:mt-4 sm:block sm:text-3xl">
		Thank you for your commitment to community safety.
	</h2>
</div>
