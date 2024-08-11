<script lang="ts">
	interface Props {
		validEmail: boolean;
	}

	let { validEmail = $bindable() }: Props = $props();

	let email = $state('');

	function validateEmail(email: string) {
		let emailRegEx =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegEx.test(String(email).toLowerCase());
	}

	$effect(() => {
		validEmail = validateEmail(email);
	});
</script>

<div class="flex flex-1 flex-col items-center justify-center px-3">
	<div class="w-full rounded px-3 text-surface-950 shadow-md">
		<label class="py-2 text-xs font-bold uppercase text-orange-900" for="email"> Email: </label>
		<input
			id="email"
			type="email"
			class="form-input mb-4 w-full rounded !border !border-secondary-700 py-3"
			name="email"
			required={true}
			placeholder="Email"
			autocomplete="email"
			bind:value={email}
		/>
	</div>
</div>
