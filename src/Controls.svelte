<script>
    import * as Tone from "tone";

    let bpm = 120;
    let stopped = true;    
    export let loopDirection = 0; //0 = forward, 1 = backward, 3 = pingpong
    const loopStates = ["Forward", "Backward", "Ping Pong"];

    $: if (!isNaN(bpm)) {
        Tone.Transport.bpm.value =  bpm * 2;
    } 

    $: if (stopped) {
        Tone.Transport.stop();
    } else {
        Tone.Transport.start();
    }
</script>

<div>
    <!--BPM Control-->
    <label>
        <span>BPM</span>
        <input type="number" bind:value={bpm} />
    </label>

    <!--3-Way Loop Mode Toggle-->
    <button on:click={() => loopDirection = (loopDirection + 1) % 3} title={"Loop " + loopStates[loopDirection]}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="loop">
            <g>
                {#if loopDirection === 0} <!--Loop Forward-->   
                    <path d="M22,8l-4-4v3H3v2h15v3L22,8z"/>
                    <path d="m 22,16 -4,-4 v 3 H 3 v 2 h 15 v 3 z"/>
                {:else if loopDirection === 1} <!--Loop Backward--> 
                    <path d="m 2,8 4,4 V 9 H 21 V 7 H 6 V 4 Z"/>
                    <path d="M2,16l4,4v-3h15v-2H6v-3L2,16z"/>
                {:else if loopDirection === 2} <!--Loop Ping Pong-->            
                    <path d="M22,8l-4-4v3H3v2h15v3L22,8z"/>
                    <path d="M2,16l4,4v-3h15v-2H6v-3L2,16z"/>
                {/if}
            </g>
        </svg>
    </button>

    <!--Pause/Play Button-->
    <button on:click={() => stopped = !stopped} title="Play/Pause">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            {#if stopped}
                <path d="M8 5v14l11-7z"/>
            {:else}            
                <path d="M6 6h12v12H6z"/>
            {/if}
        </svg>
    </button>

    <button>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
		</svg>
    </button>    
</div>

<style>
    div {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
	
	label, button {
		background: var(--main);
		border: 1px solid var(--main);
        color: var(--dark);
		border-top-width: 1px; 
	}
	
	button {
        padding: 0;
        margin: 0;
		max-height: 60px;
		border-radius: 0;
	}
	
    svg {
        height: 100%;
        width: 100%;   
        fill: var(--dark); 
    }

	label {
		padding: 10px;
		display: flex;
        justify-content: center;
		align-items: center;
	}
	
	span, input {
		font-size: 15px;
		font-weight: 700;
		margin-right: 8px;
	}
	
	input {
        padding: 0;
        margin: 0;        
        border: none !important;
        background: var(--dark);
        color: var(--main);
		max-width: 6.3ch;
	}

    @media only screen and (max-width: 600px) {
		input {
			text-align: right;
		}	
	}

	/* Medium devices (landscape tablets, 768px and up) */
	@media only screen and (min-width: 768px) {
		input {
			text-align: center;
		}	
	}

    button:focus, label:focus-within {
        background: var(--dark);
	}

    button:focus path {
        fill: var(--main);
    }

    label:focus-within {
        color: var(--main);
    }

    input:focus {
        color: var(--dark);
    }

    input:focus {
        background: var(--main);
    }
</style>