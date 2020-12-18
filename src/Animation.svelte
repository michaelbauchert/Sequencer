<script>
    import {onMount} from "svelte";
    import { Transport } from "tone";

    export let sequencer, currentLength, sequenceLength, loopDirection;
    let canvas, ctx, animate, height, width;
    $: rows = Math.ceil(currentLength / 8);

    const animator = new Worker('./animateWorker.js');    

    Transport.on("start", () => animate = true);
    Transport.on("stop", () => animate = false);

    onMount(() => {
        ctx = canvas.getContext('2d');                     
    });

    $: animator.postMessage({
        currentLength: currentLength,
        sequenceLength: sequenceLength,
        loopDirection: loopDirection,
    });
    
    function sequencerAnimation() {
        animator.postMessage({progress: sequencer.progress});                   

        if(animate)
            window.requestAnimationFrame(sequencerAnimation);
    }

    $: if(animate) {
        window.requestAnimationFrame(sequencerAnimation);
    }

    animator.onmessage = function (e) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle="#f5d10d";
        ctx.fillRect(e.data % 8 / 8 * canvas.width + 5, 
                     Math.floor(e.data / 8) * (canvas.height / rows) + 5, 
                     canvas.width / 8 - 10, 
                     canvas.height / rows - 10);   
    }

</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -1;
    }
</style>