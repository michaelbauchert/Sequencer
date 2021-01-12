<script>
    import { scale } from 'svelte/transition';

	export let checked = false;
</script>

<button	on:click={() => checked = !checked} 
		aria-pressed={checked}
		transition:scale>
	<div></div>
</button>

<style>
	
	button {
		width: 100%;
		height: 0;
		padding: 0;
		padding-top: 100%;
		position: relative;		
        margin: 0;
        border-radius: 0;
        background: transparent;
		border: none;
	}
	
	button > div {
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
		overflow: hidden;
	}

	div::after {
		content: "";
		box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
		height: 100%;
		width: 100%;
		border: 7px solid var(--dark);
		background: transparent;
	}	

	button[aria-pressed=true] div::after {
		height: 100%;
		width: 100%;
        border-color: var(--main);
	}
	
	button:hover div::after, 
	button:focus div::after{
		height: 50%;
		width: 50%;
		border: 1px solid var(--main);
	}
	
	button:focus[aria-pressed=true] div::after {
		height: 100%;
		width: 100%;
		background: var(--main);
		border: 7px solid var(--dark);
	}

	button:active div {
		border-color: transparent;
	}
</style>