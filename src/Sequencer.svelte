<script>
	import * as Tone from "tone";
	
	import Step from './Step.svelte';
	import SampleSelect from "./SampleSelect.svelte";
	
	export let name = "Sequencer";
	export let src;
	export let loopDirection = 0; //0 = forward, 1 = backward, 3 = pingpong
	
	let sequence = [{checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, 
					{checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, 
					{checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, 
					{checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}, {checked: false, active: false}];	

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
		sequenceDeleted.push(sequence.pop().checked);
		sequence = sequence;
	}
	
	function sequencePush() {
		const newStep = (sequenceDeleted.length === 0) ? ({checked: false, active: false}) : {checked: sequenceDeleted.pop(), active: false};
		sequence = [...sequence, newStep];
	}

	const sampler = new Tone.Sampler({
		urls: {
			C4: src
		}}).toDestination();
	const sequencer = new Tone.Sequence(sequencerCallback, sequence).start(0);

	let activeIndex = 0;
	function sequencerCallback(time, step) {
		if(step.checked) {
			sampler.triggerRelease("C4", time);
			sampler.triggerAttack("C4", time);
		}
		
		if(sequence[activeIndex])
			sequence[activeIndex].active = false;
		const sequencerProgress = Math.floor(sequencer.progress * currentSequence.length);
		if(loopDirection ===  0){ //Loop Forward			
			activeIndex = sequencerProgress;			
		} else if(loopDirection ===  1){//Loop Backward
			activeIndex = Math.abs(sequencerProgress - sequence.length + 1);
		} else if(loopDirection === 2){//Loop Ping Pong
			activeIndex = (sequencerProgress < sequence.length) ? sequencerProgress : sequence.length - 1 - (sequencerProgress % (sequence.length - 1));			
		}
		(sequence[activeIndex] ?? sequence[0]).active = true;	
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
			{#each sequence as step}
				<Step bind:checked={step.checked} bind:active={step.active}/>
			{/each}
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
		color: var(--main);
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
		fill: var(--main);
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
		justify-content: space-around;
	}
	
	.plus-minus button {
		border-radius: 0;
		margin: 5px;
		margin-left: 0;
		width: 50px;
		height: 50px;
	}

	.plus-minus button:focus {
		border: 1px solid var(--main);
	}

	.plus-minus button:active {
		background: var(--main);
	}

	.plus-minus button:active svg {
		fill: var(--dark);
	}
	
	button {
		border: none;
		background: none;
		padding: 0;
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