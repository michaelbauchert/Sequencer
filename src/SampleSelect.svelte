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
		border: none;
		background: none;
		padding: 0;
	}
</style>