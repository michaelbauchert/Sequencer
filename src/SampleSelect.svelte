<script>
	import { fade, fly } from 'svelte/transition';
	import { onMount, createEventDispatcher } from 'svelte';
import { create_ssr_component } from 'svelte/internal';
	const dispatch = createEventDispatcher();

	export let src = false;
	export let drag = false;
	export let sampler;
	let unloaded = true;

	const blob = window.URL || window.webkitURL;

	let fileInput;
	
	function updateAudioSample(e) {
		const files = e.target.files;
		if (files) {
			unloaded = true;
			src = files[0].name;	
			sampler.add("C4", blob.createObjectURL(files[0]), sampleLoaded);
		}								
	}
	
	function sampleLoaded() {		
		unloaded = false;
	}

	function handleDrop(e) {
		updateAudioSample(e.dataTransfer.files[0]);
		drag = false;
	}

	onMount(() => {
		if((typeof src) === "string") {
			sampler.add("C4", src, sampleLoaded);
			src = src.slice(src.lastIndexOf('/') + 1, src.length);
		} else {
			console.log(src)
			sampler.add("C4", blob.createObjectURL(src), sampleLoaded);
			src = src.name;	
			fileInput.scrollIntoView({behavior: "smooth", inline: "end"})
		}
	});
</script>

<button on:click={() => fileInput.click()} 
		class:unloaded 
		style="display: { (src = false) ? 'none' : 'initial' }">{src}</button>
<input type="file"  
	   accept="audio/*" 
	   bind:this={fileInput} 
	   on:change={updateAudioSample} />


	<div class="file-drop"
		 class:drag
		 class:window
		 on:dragover|preventDefault={() => drag = true}
		 on:dragleave|preventDefault={() => drag = false}
		 on:drop|preventDefault={handleDrop}>
		
		 {#if drag}
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" in:fly="{{y: 75, delay: 50, duration: 300}}">
				<path d="M10 4H2v16h20V6H12l-2-2z"/>
			</svg>
			<strong in:fade="{{delay: 150, duration: 300}}">Drop Audio File</strong>
		{/if}
	</div>

<style>
	svg {
		fill: var(--dark);
		width: 30%;
		height: auto;
	}

	input {
		position: absolute;
		opacity: 0;
		height: 0;
		width: 0;
		right: 0;
	}
	
	button {
		width: max-content;
		height: min-content;
		border: 1px solid var(--main);
		border-radius: 0;
		background: var(--main);
		padding: 0;
		padding-left: 4px;
		padding-right: 4px;		
		color: var(--dark);		
	}

	button:hover, button:focus {
		text-decoration: underline;
	}

	button:active {
		background: transparent;
		color: var(--main);
	}

	button, .file-drop {		
		transition: filter 150ms;
	}

	.file-drop {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;	
		z-index: -1;
		filter: opacity(0%);
		color: var(--dark);
		background: var(--main);
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.file-drop * {
		pointer-events: none;
	}

	.drag {
		z-index: 1;
		filter: opacity(100%);
	}

	.unloaded {
		filter: brightness(50%) saturate(50%);
	}
</style>