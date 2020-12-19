<script>
    import * as Tone from "tone";
    import Knob from "./Knob.svelte";
    import Dialog from "./Dialog.svelte";
    import AppInfo from "./AppInfo.svelte";
    import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

    let bpm = 120;
    let dialogBPM, fileInput; //, appBarBPM;
    let stopped = true;  
    let appInfoOpen = false;
    let bpmOpen = false; 
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

    async function startContext() {
        await Tone.start();
        console.log("context started");
    }

    onMount(() =>{
        dialogBPM.$on("input", (e) => bpm = e.detail.value);
        //appBarBPM.$on("input", (e) => bpm = e.detail.value);
    })

    function newAudioSample(e) {
        const files = e.target.files;
		if (files.length != 0) {
            dispatch('create', {file: files[0]});
		}	        
    }

    
</script>

<Dialog bind:open={appInfoOpen}>
    <AppInfo />
</Dialog>

<Dialog bind:open={bpmOpen}>
    <Knob shortname="" 
             min="20" 
             max="999" 
             value={bpm}
             unit="BPM"
             bind:this={dialogBPM}></Knob>
</Dialog>


<div>
    <button on:click={() => appInfoOpen = true}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path xmlns="http://www.w3.org/2000/svg" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        <span>App Info</span>
    </button>

    <!--3-Way Loop Mode Toggle-->
    <button on:click={() => loopDirection = (loopDirection + 1) % 3}>
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
        <span>{"Loop " + loopStates[loopDirection]}</span>
    </button>

    <!--Pause/Play Button-->
    <button on:click|once={startContext}
            on:click={() => stopped = !stopped}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            {#if stopped}
                <path d="M8 5v14l11-7z"/>
            {:else}            
                <path d="M6 6h12v12H6z"/>
            {/if}
        </svg>
        <span>{stopped ? 'Play' : 'Stop'}</span>
    </button> 

    <button class="bpm-button"
            on:click={() => bpmOpen = true}>
        <strong>{bpm}</strong>
        <span>Beats Per Minute</span>
    </button>

    <!--<:global(.knob) class="bpm-knob"            
             shortname="" 
             min="20" 
             max="999" 
             value={bpm}
             unit="BPM"
             bind:this={appBarBPM}></:global(.knob)>    -->  

    <button on:click={() => fileInput.click()}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
			<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <span>Add Sequence</span>
    </button>
</div>

<input type="file"  
	   accept="audio/*" 
	   bind:this={fileInput} 
	   on:change={newAudioSample} />

<style>
    input {
        display: none;
    }

    div {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));              
	}
	
	label, button {
		background: var(--main);
		border: 1px solid var(--main);
        color: var(--dark);
		border-top-width: 1px; 
	}
	
	button {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
        margin: 0;
		max-height: 60px;
		border-radius: 0;
	}

    button span {
        font-size: 10px;         
        padding-bottom: 3px;
        font-weight: 600;
    }

    button strong {
        font-weight: 600;
        font-size: 30px;
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
	
	label span, input {
		font-size: 15px;
		font-weight: 700;
		margin-right: 8px;
	}
	
	input {
        padding: 0;
        margin: 0;      
        text-align: center;  
        border: none !important;
        background: var(--dark);
        color: var(--main);
		max-width: 6.3ch;
	}

    button:focus, label:focus-within {
        background: var(--dark);
	}

    button:focus path {
        fill: var(--main);
    }

    label:focus-within, 
    button:focus span, 
    button:focus strong {
        color: var(--main);
    }

    input:focus {
        color: var(--dark);
    }

    input:focus {
        background: var(--main);
    }

    @media only screen and (min-width: 992px) {
		div {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: repeat(5, minmax(0, 1fr));
		}

        button {
            max-height: 100%;
            justify-content: center;
        }

        svg {
            height: auto;
        }

        /*.bpm-knob {
            display: initial;
        }

        .bpm-button {
            display: none;
        }*/
	}

    

    
</style>