<script>
	import Sequencer from "./Sequencer.svelte";
	import Controls from "./Controls.svelte";	

	let loopDirection = 0;


</script>

<main>
	<div class="parts">
		<Sequencer name="Kick" src="./samples/kick02.wav" loopDirection={loopDirection}/>
		<Sequencer name="Snare" src="./samples/snare02.wav" loopDirection={loopDirection}/>
		<Sequencer name="Hi Hat" src="./samples/hhclosed.wav" loopDirection={loopDirection}/>
	</div>
	

	<Controls bind:loopDirection={loopDirection} />	
</main>


<style>	
	:global(body, html) {
		padding: 0;
		overflow: hidden;
	}
	
	main {		
		overflow: hidden;	
		display: grid;
		height: 100%;
		grid-template-rows: minmax(0, 1fr) 60px;
	}	
	
	.parts {
		padding: 8px;
		width: calc(100% - 16px);
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
	}	
</style>