<script lang="ts">
	type Props = {
		validPassword: boolean;
	};

	let { validPassword = $bindable() }: Props = $props();

	let strength = $state(0);
	let validations: boolean[] = $state([]);
	let showPassword = $state(false);

	let inputType = $derived(showPassword ? 'text' : 'password');
	let password = $state('');
	let confirmPassword = $state('');

	let validPasswordDerived = $derived(strength === 5);

	$effect(() => {
		validPassword = validPasswordDerived;
	});

	function validatePassword(e: Event) {
		password = (e.target as HTMLButtonElement).value;
		updateValidations();
	}

	function validateConfirmPassword(e: Event) {
		confirmPassword = (e.target as HTMLButtonElement).value;
		updateValidations();
	}

	function updateValidations() {
		validations = [
			password.length > 8,
			password.search(/[A-Z]/) > -1,
			password.search(/[0-9]/) > -1,
			password.search(/[?~!@#%^&{text}*()_+-=,:;|]/) > -1,
			password === confirmPassword
		];
		strength = validations.reduce((acc, cur) => acc + +cur, 0);
	}
</script>

<div class="flex flex-1 flex-col items-center justify-center px-3">
	<div class="w-full rounded px-3 text-surface-950 shadow-md">
		<div class="flex justify-between">
			<label class="pt-2 text-xs font-bold uppercase text-orange-900" for="password">
				Password:
			</label>

			<span
				class="text-scale-6 mr-3 font-normal text-surface-950"
				onmouseenter={() => (showPassword = true)}
				onmouseleave={() => (showPassword = false)}
				role="button"
				tabindex="0"
			>
				{showPassword ? '👁️' : '👁️'}
			</span>
		</div>
		<input
			class="form-input mb-4 w-full rounded !border !border-secondary-700 py-3"
			id="password"
			type={inputType}
			name="password"
			required={true}
			placeholder="New Password"
			autocomplete="new-password"
			oninput={validatePassword}
			value={password}
		/>
		<div class="flex justify-between">
			<label class="inline text-xs font-bold uppercase text-orange-900" for="confirmPassword">
				Confirm Password:
			</label>
			<span
				class="text-scale-6 mr-3 font-normal text-surface-950"
				onmouseenter={() => (showPassword = true)}
				onmouseleave={() => (showPassword = false)}
				role="button"
				tabindex="0"
			>
				{showPassword ? '👁️' : '👁️'}
			</span>
		</div>
		<!-- svelte-ignore a11y_autocomplete_valid -->
		<input
			id="confirmPassword"
			type={inputType}
			class="form-input mb-4 w-full rounded !border !border-secondary-700 py-3"
			name="confirmPassword"
			required={true}
			placeholder="Confirm New Password"
			autocomplete="new-password"
			oninput={validateConfirmPassword}
			value={confirmPassword}
		/>

		<div class="flex h-5 w-full bg-gray-50">
			<span class="bar bar-1" class:bar-show={strength > 0}></span>
			<span class="bar bar-2" class:bar-show={strength > 1}></span>
			<span class="bar bar-3" class:bar-show={strength > 2}></span>
			<span class="bar bar-4" class:bar-show={strength > 3}></span>
		</div>

		<ul class="text-scale-4eft mt-2 list-none pl-1">
			Your password must have:
			<li class="pl-4">
				<span class="text-[10px]">{validations[0] ? '✔️' : '❌'}</span>
				<span>at least 8 characters</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[1] ? '✔️' : '❌'}</span>
				<span>at least 1 capital letter</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[2] ? '✔️' : '❌'}</span>
				<span>at least 1 number</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[3] ? '✔️' : '❌'}</span>
				<span>at least 1 symbol (?~!@#%^&$&*()_+-=,:;|)</span>
			</li>
			<li class="pl-4">
				<span class="text-[10px]">{validations[4] ? '✔️' : '❌'}</span>
				<span>matching passwords</span>
			</li>
		</ul>
	</div>
</div>

<style>
	.bar {
		margin-right: 2px;
		margin-top: 4px;
		margin-bottom: 4px;
		border-radius: 5px;
		height: 90%;
		width: 25%;
		transition: box-shadow 500ms;
		box-shadow: inset 0px 20px #e7e5e4;
	}
	.bar-show {
		box-shadow: none;
	}
	.bar-1 {
		background: linear-gradient(to right, red, orangered);
	}
	.bar-2 {
		background: linear-gradient(to right, orangered, yellow);
	}
	.bar-3 {
		background: linear-gradient(to right, yellow, yellowgreen);
	}
	.bar-4 {
		background: linear-gradient(to right, yellowgreen, green);
	}
	.bar:last-child {
		margin-right: 0;
	}
</style>
