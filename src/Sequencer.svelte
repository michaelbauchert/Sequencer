<script>
	import * as Tone from "tone";

	import { scale } from 'svelte/transition';
	import SampleSelect from "./SampleSelect.svelte";
	
	export let name = "Sequencer";
	export let src;
	export let loopDirection = 0; //0 = forward, 1 = backward, 3 = pingpong
	
	let sequence = [false, false, false, false,
					false, false, false, false,
					false, false, false, false,
					false, false, false, false,];	

	$: reverseSequence = sequence.reverse();

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

	const sampler = new Tone.Sampler({
		urls: {
			C4: src
		}}).toDestination();
	const sequencer = new Tone.Sequence(sequencerCallback, sequence).start(0);

	let stepElements = [];
	let activeIndex = 0;
	function sequencerCallback(time, step) {
		if(step) {
			sampler.triggerRelease("C4", time);
			sampler.triggerAttack("C4", time);
		}
		stepElements[activeIndex].classList.remove("step");
		const sequencerProgress = Math.floor(sequencer.progress * currentSequence.length);
		if(loopDirection ===  0){ //Loop Forward			
			activeIndex = sequencerProgress;			
		} else if(loopDirection ===  1){//Loop Backward
			activeIndex = Math.abs(sequencerProgress - currentSequence.length - 1);
		} else if(loopDirection === 2){//Loop Ping Pong
			activeIndex = (sequencerProgress < sequence.length) ? sequencerProgress : sequence.length - 1 - (sequencerProgress % (sequence.length - 1));
			
		}
		stepElements[activeIndex].classList.add("step");			
	}
	
</script>

<section>
	<header>
	<div style="--active-index: {activeIndex}">
			<h1 bind:innerHTML={name}
			contenteditable="true"></h1>
			<SampleSelect bind:src={src} />			
		</div>		
		
		<!--<div>
			<button>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
					<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
				</svg>
			</button>
			<button>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
					<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
				</svg>
			</button>			
		</div>-->		
	</header>
	

	<div class="container">
		<div class="sequencer">
			{#each sequence as step, i}
				<label bind:this={stepElements[i]}
					   transition:scale="{{duration: 150}}">
					<input type="checkbox" bind:checked={step} />
					<div></div>
				</label>	
			{/each}
		</div>
	</div>
	
	
	<div class="plus-minus">
		{#if minusEnabled}
			<button class="minus" on:click={sequencePop}>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
					<path d="M19 13H5v-2h14v2z"/>
				</svg>
			</button>
		{/if}
		<button class="plus" on:click={sequencePush}>
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
			</svg>
		</button>
	</div>
	
</section>

<style>
	section {
		padding: 8px;
		height: 100%;
		min-width: 100%;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		scroll-snap-align: start;
	}
	
	header {
		display: flex;
		justify-content: space-between;
	}
	
	 header button {
		height: calc(100% - 8px);
		width: 50px
	}
	
	h1 {
		margin: 0;
	}
	
	svg {
		height: 100%;
		width: 100%;
	}
	
	.container {
		height: 100%;
		overflow-y: auto;
	}
	
	.sequencer {		
		height: max-content;
		grid-gap: 5px;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
	}
	
	.plus-minus {
		display: flex;
		justify-content: center;
	}
	
	.plus-minus button {
		margin: 5px;
		margin-left: 0;
		width: 50px;
		height: 50px;
	}
	
	button {
		border: none;
		background: none;
		padding: 0;
	}

	label input {
		position: absolute;
		opacity: 0;
		height: 0;
		width: 0;
	}
	
	label {
		width: 100%;
		height: 0;
		padding-top: 100%;
		position: relative;
		
	}
	
	label div {
		mix-blend-mode: multiply;
		background: lightgrey;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	
	input:checked + div {
		background: grey;
	}
	
	label:active div {
		border: 1px solid black;
	}
	
	label:hover div {
		opacity: 0.5;
	}

	:global(.step) {
		background: lightcoral;
	}

	@media only screen and (max-width: 600px) {
		section {
			min-width: 100%;
		}	
	}

	/* Medium devices (landscape tablets, 768px and up) */
	@media only screen and (min-width: 768px) {
		section {
			min-width: 50%;
		}	
	}

	/* Large devices (laptops/desktops, 992px and up) */
	@media only screen and (min-width: 992px) {
		section {
				min-width: 25%;
			}		
	}

	/* Extra large devices (large laptops and desktops, 1200px and up) */
	@media only screen and (min-width: 1200px) {
		section {
				min-width: 20%;
			}	
	}
	
</style>