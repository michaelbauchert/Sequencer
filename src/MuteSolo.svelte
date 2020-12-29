<script>
    export let mute = false;
    export let solo = false;
</script>

<label class="mute">
    <input type="checkbox" bind:checked={mute}/>
	M
</label>

<label class="solo">
    <input type="radio" name="solo" on:change={(e) => solo = e.target.checked}/>
	S
</label>

<style>
    .mute {
        grid-area: mute;
    }

    .solo {
        grid-area: solo;
    }

    label input {
		position: absolute;
		opacity: 0;
		height: 0;
		width: 0;
	}

    label {
        height: min-content;
        box-sizing: border-box;
        border: 1px solid var(--main);           
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div {
        padding: 0;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        
    }

</style>