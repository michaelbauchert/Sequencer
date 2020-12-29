<script>
	import { Sampler, Sequence, Transport, Channel, Destination, Volume } from "tone";
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	import Waveform from "./Waveform.svelte";
	import Knob from "./Knob.svelte";
	import MuteSolo from "./MuteSolo.svelte";
	import Step from './Step.svelte';
	import SampleSelect from "./SampleSelect.svelte";
	import Animation from "./Animation.svelte";
		
	export let name = "Sequencer";
	export let src = false;
	export let loopDirection = 0; //0 = forward, 1 = backward, 3 = pingpong
	export let drag = false;
	export let mute = false;
	export let solo = false;
	export let volume = 0;
	export let panning = 0;
	
	export let sequence = [false, false, false, false, false, false, false, false,
					false, false, false, false,false, false];	
	$: reverseSequence = sequence.slice().reverse();
	$: pingPongSequence = [...sequence, 
						   ...sequence.slice(1, sequence.length - 1).reverse()];
	
	let currentSequence, buffer;
	$: {		
		if(loopDirection ===  0){ //Loop Forward
			currentSequence = sequence;
		} else if(loopDirection ===  1){//Loop Backward
			currentSequence = reverseSequence;
		} else if(loopDirection === 2){//Loop Ping Pong
			currentSequence = pingPongSequence;
		}
		sequencer.events = currentSequence;
	}		
	
	let sequenceDeleted = [];
	
	$: minusEnabled = (sequence.length != 0);
	
	function sequencePop() {
		sequenceDeleted.push(sequence.pop());
		sequence = sequence;
	}
	
	function sequencePush() {
		const newStep = (sequenceDeleted.length === 0) ? false : sequenceDeleted.pop();
		sequence = [...sequence, newStep];
	}

	const channel = new Channel(volume, panning);
	$:channel.mute = mute;
	$:channel.solo = solo;
	$:channel.volume.rampTo(volume);
	$:channel.pan.rampTo(panning);

	const sampler = new Sampler().chain(channel, Destination);
	const sequencer = new Sequence(sequencerCallback, sequence).start(0);

	function sequencerCallback(time, step) {
		if(step) {
			sampler.triggerRelease("C4", time - 0.01);
			sampler.triggerAttack("C4", time);
		}		
	}

	//stop playing samples when transport stops
	Transport.on("stop", () => sampler.triggerRelease("C4"));	
</script>

<header>
	<!---->

	
		<SampleSelect bind:src={src} 
				  bind:drag={drag}
				  bind:buffer={buffer}
				  sampler={sampler}
				  on:fail={() => dispatch('remove')}/>

				  <MuteSolo bind:mute={mute} />

	<!--Remove Sequencer Button-->
	<button class="delete"
			on:click={() => dispatch('remove')}>
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
			<path xmlns="http://www.w3.org/2000/svg" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
		</svg>
		</button>

	<Waveform buffer={buffer}
			  audioContext={sampler.context} />
</header>

<div class="container">
	<div class="sequencer">
		{#each sequence as step}
			<Step bind:checked={step}/>
		{/each}
		<Animation sequencer={sequencer} 
				sequenceLength={sequence.length}
				currentLength={currentSequence.length}
				loopDirection={loopDirection} />
	</div>
</div>

<footer class="bottom-controls">
	{#if minusEnabled}
		<button class="minus" on:click={sequencePop} title={`Remove ${name} Step`}>
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
				<path d="M19 13H5v-2h14v2z"/>
			</svg>
		</button>
	{/if}
	<button class="plus" on:click={sequencePush} title={`Add ${name} Step`}>
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
		</svg>
	</button>
	
	<Knob name="Volume" min="-72" max="12" defaultvalue="0" unit="dB" textposition="left"/>
	<Knob name="Panning" min="-100" max="100" defaultvalue="0" textposition="left"/>
</footer>

<style>	
	header {
		display: grid;
		grid-gap: 5px;
		margin-bottom: 5px;
		position: relative;
		grid-template-columns: min-content repeat(2, calc(100% / 8 - 5px)) 1fr calc(100% / 8 - 5px);
		grid-template-rows: auto minmax(0, 1fr);
		grid-template-areas: 
		'select mute solo none delete'
		'sample sample sample sample sample';		
	}

	header :global(button) {
		margin: 0;
	}

	header div {
		height: min-content;
		display: flex;
		grid-area: group;
	}
	
	h1 {
		margin: 0;
	}

	svg {
		fill: var(--main);
	}
	
	.bottom-controls svg {
		height: 100%;
		width: 100%;
	}
	
	.container {
		height: 100%;
		overflow-y: auto;
	}
	
	.sequencer {		
		position: relative;
		min-width: 100%;
		height: max-content;
		grid-gap: 5px;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
	}

	.bottom-controls {
		display: grid;
		grid-gap: 10px;
		grid-template-rows: repeat(2, minmax(0, 1fr));
		grid-template-columns: repeat(2, 1fr) 40%;
		grid-template-areas: 
		'plus minus volume'
		'plus minus panning';
	}

	.plus {
		grid-area: plus;
	}

	.minus {
		grid-area: minus;
	}

	.bottom-controls :global(.knob) {
		--grid-gap: 0 !important;
		--label-font-size: 15px !important;
		--value-font-size: 15px !important;
	}

	.bottom-controls :global(.knob:nth-of-type(1)) {
		grid-area: volume;
	}

	.bottom-controls :global(.knob:nth-of-type(2)) {
		grid-area: panning;
	}

	.delete{
		grid-area: delete;
		box-sizing: border-box;
        border: 1px solid transparent;
        display: flex;
        justify-content: center;
        align-items: center;
	}
	
	.bottom-controls button {
		border-radius: 0;
		margin: 0;
	}

	.bottom-controls button:focus,
	header div button:focus {
		border: 1px solid var(--main);
	}

	.bottom-controls button:active, 
	header div button:active {
		background: var(--main);
	}

	.bottom-controls button:active svg, 
	header div button:active svg {
		fill: var(--dark);
	}
	
	button {
		border: none;
		background: none;
		padding: 0;
		margin: 0;
	}	
</style>