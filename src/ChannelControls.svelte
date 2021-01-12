<script>    
    import { soloId } from './solo.js';
    import Knob from "./Knob.svelte"; 

    export let channel, id;
    let volume = 0;
    let panning = 0;    
    let mute = false;
    $:solo = ($soloId === id);
    
	$:if (mute) {
        channel.volume.rampTo(-Infinity);
    } else {
        channel.volume.rampTo(volume);
    }

    $:channel.pan.rampTo(panning);
    $:console.log(panning);
    $:channel.solo = solo;

    function toggleSolo() {
        if(!solo) {
            soloId.set(id);
        } else {
            soloId.set(-1);
        }        
    }
</script>

<Knob name="Gain" 
      min="-72" 
      max="12" 
      defaultvalue="0" 
      unit="dB"
      on:input={(e) => volume = e.detail.value} />

<Knob name="Pan"
      min="-100" 
      max="100" 
      defaultvalue="0" 
      on:input={(e) => panning = e.detail.value / 100.00}/>

<button class="mute" on:click={() => mute = !mute} aria-pressed={mute}>M</button>
<button class="solo" on:click={toggleSolo} aria-pressed={solo}>S</button>

<style>
    :global(.bottom-controls .knob) {
		--grid-gap: 0 !important;
		--label-font-size: 15px !important;
		--value-font-size: 15px !important;
	}

	:global(.bottom-controls .knob:nth-of-type(1)) {
		grid-area: volume;
	}

	:global(.bottom-controls .knob:nth-of-type(2)) {
		grid-area: panning;
	}

    .mute {
        grid-area: mute;
    }

    .solo {
        grid-area: solo;
    }

    .mute, 
    .solo {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid var(--main);           
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin: 0;
        border-radius: 0;
        background: transparent;
        color: var(--main);
    }

    button[aria-pressed=true] {
        color: var(--dark);
        background: var(--main);
    }

    button:active {
        color: var(--main);
        background: transparent;
    }

    button:focus {
        text-decoration: underline;
    }
</style>