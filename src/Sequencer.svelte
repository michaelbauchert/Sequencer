<script>
	import { Sampler, Sequence, Transport } from "tone";
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	import Knob from "./Knob.svelte";
	import Step from './Step.svelte';
	import SampleSelect from "./SampleSelect.svelte";
	import Animation from "./Animation.svelte";
		
	export let name = "Sequencer";
	export let src = false;
	export let loopDirection = 0; //0 = forward, 1 = backward, 3 = pingpong
	export let hue = 0;
	export let drag = false;
	
	export let sequence = [false, false, false, false, false, false, false, false,
					false, false, false, false,false, false, false, false];	
	$: reverseSequence = sequence.slice().reverse();
	$: pingPongSequence = [...sequence, 
						   ...sequence.slice(1, sequence.length - 1).reverse()];
	
	let currentSequence;
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

	const sampler = new Sampler().toDestination();
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
	<h1>{name}</h1>

	<!--Remove Sequencer Button-->
	<button on:click={() => dispatch('remove')}>
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
			<path xmlns="http://www.w3.org/2000/svg" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
		</svg>
	</button>				
</header>

<SampleSelect bind:src={src} 
				bind:drag={drag}
				sampler={sampler}
				on:fail={() => dispatch('remove')}/>		


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


<div class="plus-minus">
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

	<!--<Knob name="Gain" min="-72" max="12" defaultvalue="0" unit="dB" />
	<Knob name="Pan" min="-100" max="100" defaultvalue="0" />-->
</div>	

<style>	
	header {
		display: flex;
		justify-content: space-between;
	}
	
	h1 {
		margin: 0;
	}

	svg {
		fill: var(--main);
	}
	
	.plus-minus svg {
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
	
	.plus-minus {
		display: flex;
		justify-content: space-around;
	}

	header div button {
		border: 1px solid transparent;
		border-radius: 0;
	}
	
	.plus-minus button {
		border-radius: 0;
		margin: 5px;
		margin-left: 0;
		width: 50px;
		height: 50px;
	}

	.plus-minus button:focus,
	header div button:focus {
		border: 1px solid var(--main);
	}

	.plus-minus button:active, 
	header div button:active {
		background: var(--main);
	}

	.plus-minus button:active svg, 
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