<script>
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import Sequencer from "./Sequencer.svelte";
	import Controls from "./Controls.svelte";	

	let loopDirection = 0;
	let idCount = 1;
	let sequencers = [{id: idCount++, src: "./samples/kick02.wav", drag: false},
					  {id: idCount++, src: "./samples/snare02.wav", drag: false},
					  {id: idCount++, src: "./samples/hhclosed.wav", drag: false},];

	function removeSequence(i) {
		sequencers.splice(i, 1);
		sequencers = sequencers;
	}

	function addSequencer(e) {
		sequencers = [...sequencers, 
		{
			id: idCount++, 
			src: e.detail.file, 
			drag: false,
		}] ;				
	}

</script>

<main>
	<div class="parts">
		{#each sequencers as sequencer, i (sequencer.id)}
			<section style="filter: hue-rotate({i / sequencers.length * 360}deg)" 	
					 on:dragenter|preventDefault|stopPropagation={() => sequencers.drag = true}					 
					 animate:flip="{{delay: 200, duration: 300, easing: cubicOut}}"
					 transition:fade="{{duration: 200}}">
				<Sequencer name={`${(i + 1)}/${sequencers.length}`} 
						id = {sequencer.id}
						bind:src={sequencer.src} 
						bind:sequence={sequencer.sequence}
						loopDirection={loopDirection} 
						on:remove={() => removeSequence(i)}/>
			</section>			
		{/each}
	</div>	

	<Controls bind:loopDirection={loopDirection}
			  on:create={addSequencer} />	
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

	section {
		background: var(--dark);
		border: 5px solid var(--main);
		box-sizing: border-box;
		padding: 8px;
		height: 100%;
		display: grid;
		grid-template-rows: 80px minmax(0, 1fr) 80px;
		scroll-snap-align: start;
		color: var(--main);
		transition: filter 250ms 150ms;
	}	
	
	.parts {
		display: flex;
		flex-wrap: wrap;		
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
	}

	@media only screen and (max-width: 600px) {
		section {
			width: 100%;
		}
	}

	/* Small devices (portrait tablets and large phones, 600px and up) */
	@media only screen and (min-width: 600px) {
		section {			
			width: 50%;
			height: 50%;
		}
	}

	@media only screen and (min-width: 768px) {
		section {
			width: 33.33333%;
		}
	}

	@media only screen and (min-width: 992px) {
		main {
			grid-template-columns: minmax(0, 1fr) 60px;
			grid-template-rows: minmax(0, 1fr);
		}

		section {
			width: 25%;
		}
	}

	@media only screen and (min-width: 1200px) {
		section {
			width: 20%;
		}
	}

	@media only screen and (min-width: 1600px) {
		section {
			width: calc(100% / 6);
		}
	}	
</style>