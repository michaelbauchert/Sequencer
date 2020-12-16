<script>
	export let src;

	let fileInput;
	
	function updateAudioSample() {
		src = fileInput.files[0].name;
	}
</script>

<button on:click={() => fileInput.click()}>{src}</button>
<input type="file"  accept="audio/*" bind:this={fileInput} on:change={updateAudioSample}/>

<style>
	input {
		position: absolute;
		opacity: 0;
		height: 0;
		width: 0;
	}
	
	button {
		border: 1px solid var(--main);
		border-radius: 0;
		background: transparent;
		padding: 0;
		padding-left: 4px;
		padding-right: 4px;
		
		background: var(--main);
		color: var(--dark);
	}

	button:hover, button:focus {
		text-decoration: underline;
	}

	button:active {
		background: transparent;
		color: var(--main);
	}
</style>