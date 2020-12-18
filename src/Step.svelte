<script>
    import { scale } from 'svelte/transition';

	export let checked = false;
	export let disabled = false;
</script>

<label transition:scale="{{duration: 150}}">
    <input type="checkbox" bind:checked={checked}/>
	<div></div>
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

	input:checked + div::after {
		height: 100%;
		width: 100%;
        border-color: var(--main);
	}
	
	label:hover div::after, input:focus + div::after{
		height: 50%;
		width: 50%;
		border: 1px solid var(--main);
	}
	
	label:focus-within input:checked + div::after {
		height: 100%;
		width: 100%;
		background: var(--main);
		border: 7px solid var(--dark);
	}
</style>