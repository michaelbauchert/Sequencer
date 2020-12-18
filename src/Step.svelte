<script>
    import { scale } from 'svelte/transition';

    export let indicator;
    export let checked = false;
</script>

<label transition:scale="{{duration: 150}}">
    <input type="checkbox" bind:checked={checked} />
	<div>
		<div bind:this={indicator}></div>
	</div>
</label>

<style>
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
	
	label > div {
		position: absolute;        
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        border: 1px solid var(--main);

        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--dark);
        font-size: 2vw;
        line-height: 0;
		overflow: hidden;
	}

	div div {
		box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
		height: 100%;
		width: 100%;
		border: 10px solid var(--dark);
		background: transparent;
	}
	
	input:checked + div {
        background-color: var(--main);
	}
	
	label:hover div, input:focus + div {
		border-color: var(--main);
	}
</style>