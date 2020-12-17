<script>
	import Sequencer from "./Sequencer.svelte";
	import Controls from "./Controls.svelte";	

	let loopDirection = 0;

	let sequencers = ["./samples/kick02.wav", 
					  "./samples/snare02.wav",
					  "./samples/hhclosed.wav",];

	function removeSequence(i) {
		sequencers.splice(i, 1);
		sequencers = sequencers;
	}

</script>

<main>
	<div class="parts">
		{#each sequencers as sequencer, i}
			<Sequencer name={i + 1} 
					   src={sequencer} 
					   loopDirection={loopDirection} 
					   hue={i / sequencers.length * 360}
					   on:remove={() => removeSequence(i)}/>
		{/each}
	</div>
	

	<Controls bind:loopDirection={loopDirection} />	
</main>


<style>	
	:global(body, html) {
		padding: 0;
		overflow: hidden;
		--dark: #020202;
		--main: #f5d10d;
		background: var(--dark);
	}
	
	main {		
		overflow: hidden;	
		display: grid;
		height: 100%;
		grid-template-rows: minmax(0, 1fr) 60px;
	}	
	
	.parts {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;		
		align-content: baseline;
		max-width: 100%;
		max-height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
	}	
	
</style>